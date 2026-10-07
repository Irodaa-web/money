import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyFamily } from '../lib/store.js';
import { createTask, changeTask, createGoal, changeGoal, createPayout, changePayout, snapshot, wallet } from '../lib/domain.js';
import { hashPassword, checkPassword } from '../lib/security.js';
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
