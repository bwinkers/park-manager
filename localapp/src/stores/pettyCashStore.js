import { defineStore, acceptHMRUpdate } from 'pinia'
//import { computed } from 'vue';
import { liveQuery } from 'dexie';
import { useObservable } from '@vueuse/rxjs';
import { db } from 'src/boot/dexie'

export const usePettyCashStore = defineStore('pettyCash', ()=>{
  const transactions = useObservable(liveQuery(() => db.pettyCash.toArray()));

  // Actions to interact with Dexie
  async function addItem(name, value) {
    // legacy convenience - store under both name/value for backwards compatibility
    await db.pettyCash.add({ name, value, amount: value });
  }

  async function addTransaction(obj) {
    // expects object matching db schema (without id)
    await db.pettyCash.add(obj);
  }

  async function deleteItem(id) {
    await db.pettyCash.delete(id);
  }

  const totalCash = useObservable(
    liveQuery(() =>
      db.pettyCash
        .toArray()
        .then(arr => arr.reduce((sum, t) => {
          const amt = Number(t.amount ?? t.value ?? 0)
          return sum + (t.isCredit ? amt : -amt)
        }, 0))
    )
  );

  return { transactions, addItem, addTransaction, deleteItem, totalCash };
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePettyCashStore, import.meta.hot))
}
