import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFamily } from '../lib/store.js';
import { createTask, changeTask, createGoal, changeGoal, createPayout, changePayout, snapshot, wallet } from '../lib/domain.js';
import { hashPassword, checkPassword } from '../lib/security.js';
import { childProgress, levelProgress } from '../lib/progression.js';
import { familyBalances } from '../lib/domain.js';
const parent = { id: 'a'.repeat(24), role: 'parent', name: 'Ota' };
const child = { id: 'b'.repeat(24), role: 'child', parentId: parent.id, name: 'Bola' };
const body = () => ({ title: 'Xonani yig‘ishtir', description: '', amount: 20000, childId: child.id, dueAt: new Date(Date.now() + 86400000).toISOString() });
function setup() { const data = emptyFamily(); const task = createTask(data, parent.id, body(), [child.id]); return { data, task }; }
test('child submission waits, parent approval removes task and rewards exactly once', () => {
  const { data, task } = setup();
  changeTask(data, child, task.id, { action: 'submit' });
  assert.equal(data.tasks[0].status, 'pending'); assert.equal(wallet(data, child.id).balance, 0);
  assert.equal(data.notifications[0].userId, parent.id);
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(data.tasks.length, 0); assert.equal(wallet(data, child.id).balance, 20000);
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  assert.equal(data.transactions.length, 1);
});
test('child cannot approve own work and unrelated users cannot submit it', () => {
  const { data, task } = setup();
  assert.throws(() => changeTask(data, child, task.id, { action: 'approve' }));
  assert.throws(() => changeTask(data, { ...child, id: 'c'.repeat(24) }, task.id, { action: 'submit' }));
  assert.throws(() => createTask(data, parent.id, { ...body(), childId: 'stranger' }, [child.id]));
});
test('parent must wait for submission; return requires a note; resubmission works', () => {
  const { data, task } = setup();
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  changeTask(data, child, task.id, { action: 'submit' });
  assert.throws(() => changeTask(data, parent, task.id, { action: 'return', note: '' }));
  changeTask(data, parent, task.id, { action: 'return', note: 'Kitoblarni ham joylang.' });
  assert.equal(data.tasks[0].status, 'active');
  changeTask(data, child, task.id, { action: 'submit' });
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(wallet(data, child.id).balance, 20000);
});
test('invalid reward and past deadlines are rejected', () => {
  for (const amount of [-1000, 0, 1.5, Infinity, '20000', 10000001]) assert.throws(() => createTask(emptyFamily(), parent.id, { ...body(), amount }, [child.id]));
  assert.throws(() => createTask(emptyFamily(), parent.id, { ...body(), dueAt: '2020-01-01' }, [child.id]));
});
test('pending payouts reserve funds; saving or requesting the same funds twice fails', () => {
  const data = emptyFamily(); data.wallets[child.id] = 30000;
  createPayout(data, child, { amount: 20000, title: 'Kitob' });
  assert.equal(wallet(data, child.id).available, 10000);
  assert.throws(() => createPayout(data, child, { amount: 20000, title: 'Kitob' }));
  createGoal(data, child.id, { title: 'Velosiped', target: 100000 });
  assert.throws(() => changeGoal(data, child.id, data.goals[0].id, { action: 'save', amount: 20000 }));
  changeGoal(data, child.id, data.goals[0].id, { action: 'save', amount: 10000 });
  changePayout(data, parent.id, data.payouts[0].id, { action: 'approve' });
  assert.equal(wallet(data, child.id).balance, 0);
  assert.throws(() => changePayout(data, parent.id, data.payouts[0].id, { action: 'approve' }));
});
test('rejecting payout releases reserve without reducing balance', () => {
  const data = emptyFamily(); data.wallets[child.id] = 20000;
  createPayout(data, child, { amount: 20000, title: 'Kitob' });
  changePayout(data, parent.id, data.payouts[0].id, { action: 'reject' });
  assert.equal(wallet(data, child.id).available, 20000); assert.equal(data.transactions.length, 0);
});
test('savings can be released, cannot exceed target or be deleted with a balance', () => {
  const data = emptyFamily(); data.wallets[child.id] = 30000;
  createGoal(data, child.id, { title: 'Kitob', target: 20000 }); const id = data.goals[0].id;
  assert.throws(() => changeGoal(data, child.id, id, { action: 'save', amount: 30000 }));
  changeGoal(data, child.id, id, { action: 'save', amount: 20000 });
  assert.throws(() => changeGoal(data, child.id, id, { action: 'delete' }));
  changeGoal(data, child.id, id, { action: 'release' });
  assert.equal(wallet(data, child.id).balance, 30000);
  changeGoal(data, child.id, id, { action: 'delete' }); assert.equal(data.goals.length, 0);
});
test('child snapshots do not expose sibling wallets, tasks, goals or notifications', () => {
  const { data } = setup();
  createTask(data, parent.id, { ...body(), childId: 'sibling' }, ['sibling']);
  data.wallets.sibling = 100000; createGoal(data, 'sibling', { title: 'Private', target: 10000 });
  const result = snapshot(data, child, []);
  assert.equal(result.tasks.length, 1); assert.equal(result.goals.length, 0);
  assert.equal(result.wallets.sibling, undefined);
  assert.ok(result.notifications.every(n => n.userId === child.id));
});
test('password hashing uses separate salts and verifies passwords', async () => {
  const a = await hashPassword('VeryStrong123'), b = await hashPassword('VeryStrong123');
  assert.notEqual(a, b); assert.equal(await checkPassword('VeryStrong123', a), true);
  assert.equal(await checkPassword('WrongPassword', a), false);
});

test('XP is earned only once on parent approval, never on submission, return or cancellation', () => {
  const { data, task } = setup();
  assert.equal(childProgress(data, child.id).totalXp, 0);
  assert.throws(() => changeTask(data, child, task.id, { action: 'approve', xp: 99999 }));
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  changeTask(data, child, task.id, { action: 'submit' });
  assert.equal(childProgress(data, child.id).totalXp, 0);
  changeTask(data, parent, task.id, { action: 'return', note: 'Yana tekshiring.' });
  assert.equal(childProgress(data, child.id).totalXp, 0);
  changeTask(data, child, task.id, { action: 'submit' });
  changeTask(data, parent, task.id, { action: 'approve', xp: 99999 });
  assert.equal(childProgress(data, child.id).totalXp, 25);
  assert.throws(() => changeTask(data, parent, task.id, { action: 'approve' }));
  assert.equal(childProgress(data, child.id).totalXp, 25);
  const cancelled = createTask(data, parent.id, body(), [child.id]);
  changeTask(data, parent, cancelled.id, { action: 'delete' });
  assert.equal(childProgress(data, child.id).totalXp, 25);
});

test('every 100 XP advances one level; progress is retained across saved snapshots', () => {
  let data = emptyFamily();
  for (let i = 0; i < 5; i++) {
    const task = createTask(data, parent.id, body(), [child.id]);
    changeTask(data, child, task.id, { action: 'submit' });
    changeTask(data, parent, task.id, { action: 'approve' });
    data = JSON.parse(JSON.stringify(data));
    if (i === 3) {
      assert.deepEqual(childProgress(data, child.id), { totalXp: 100, level: 1, nextLevel: 2, currentXp: 0, requiredXp: 100, remainingXp: 100 });
      assert.match(data.notifications[0].text, /1-darajaga/);
    }
  }
  const result = snapshot(data, child, []);
  assert.equal(result.progression[child.id].totalXp, 125);
  assert.equal(result.progression[child.id].currentXp, 25);
  assert.equal(result.progression[child.id].remainingXp, 75);
  assert.equal(levelProgress(0).level, 0);
  assert.equal(levelProgress(99).remainingXp, 1);
  assert.equal(levelProgress(200).level, 2);
});

test('legacy XP uses all reward history and is persisted without double counting the next approval', () => {
  const data = emptyFamily();
  delete data.experience;
  data.transactions = Array.from({ length: 105 }, (_, i) => ({ id: String(i), childId: child.id, type: 'reward', amount: 1000 }));
  data.transactions.push({ childId: child.id, type: 'payout', amount: -5000 });
  data.transactions.push({ childId: 'sibling', type: 'reward', amount: 1000 });
  assert.equal(childProgress(data, child.id).totalXp, 2625);
  assert.equal(data.experience, undefined, 'reading old data does not mutate it');
  const task = createTask(data, parent.id, body(), [child.id]);
  changeTask(data, child, task.id, { action: 'submit' });
  changeTask(data, parent, task.id, { action: 'approve' });
  assert.equal(data.experience[child.id], 2650);
  const result = snapshot(data, child, []);
  assert.equal(result.transactions.length, 100);
  assert.equal(result.progression[child.id].totalXp, 2650);
  data.transactions = [];
  assert.equal(childProgress(data, child.id).totalXp, 2650, 'the saved counter does not depend on visible history');
});

test('children cannot see sibling XP or the parent family balance summary', () => {
  const data = emptyFamily();
  data.experience = { [child.id]: 25, sibling: 500 };
  const result = snapshot(data, child, []);
  assert.deepEqual(Object.keys(result.progression), [child.id]);
  assert.equal(result.familyBalances, undefined);
  const parentResult = snapshot(data, parent, [child, { id: 'sibling', name: 'Bola 2' }]);
  assert.equal(parentResult.progression.sibling.level, 5);
});

test('family totals include savings once and pending payouts remain a subset of balance', () => {
  const data = emptyFamily();
  const sibling = { id: 'sibling', name: 'Bola 2' };
  data.wallets = { [child.id]: 100000, sibling: 50000, unrelated: 999999 };
  createGoal(data, child.id, { title: 'Velosiped', target: 100000 });
  changeGoal(data, child.id, data.goals[0].id, { action: 'save', amount: 30000 });
  createPayout(data, child, { title: 'Kitob', amount: 20000 });
  const summary = familyBalances(data, [child, sibling]);
  assert.deepEqual(summary.totals, { balance: 120000, reserved: 20000, available: 100000, saved: 30000, owed: 150000 });
  assert.equal(summary.children[0].owed, 100000);
  assert.equal(summary.children[0].balance, 70000);
  assert.equal(summary.children[1].owed, 50000);
  changePayout(data, parent.id, data.payouts[0].id, { action: 'approve' });
  const after = familyBalances(data, [child, sibling]);
  assert.equal(after.totals.owed, 130000);
  assert.equal(after.totals.reserved, 0);
  changeGoal(data, child.id, data.goals[0].id, { action: 'release' });
  assert.equal(familyBalances(data, [child, sibling]).totals.owed, 130000);
});

test('unapproved tasks, rejected payouts and empty families do not inflate money owed or XP', () => {
  const { data, task } = setup();
  changeTask(data, child, task.id, { action: 'submit' });
  assert.equal(familyBalances(data, [child]).totals.owed, 0);
  data.wallets[child.id] = 50000;
  createPayout(data, child, { title: 'Kitob', amount: 20000 });
  changePayout(data, parent.id, data.payouts[0].id, { action: 'reject' });
  assert.equal(familyBalances(data, [child]).totals.owed, 50000);
  assert.equal(familyBalances(data, [child]).totals.reserved, 0);
  assert.equal(childProgress(data, child.id).totalXp, 0);
  assert.deepEqual(familyBalances(emptyFamily(), []), { children: [], totals: { balance: 0, reserved: 0, available: 0, saved: 0, owed: 0 } });
});
