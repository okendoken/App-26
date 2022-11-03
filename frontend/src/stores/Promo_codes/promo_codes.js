import { defineStore } from 'pinia'
import axios from 'axios'

export const usePromo_codesStore = defineStore('promo_codes', {
  state: () => ({
    data: [],
    loading: false,
    notify: {
      showNotification: false,
      textNotification: '',
      typeNotification: 'warn',
    },

            searchResultProducts: [],

  }),
  actions: {
    async fetch(id = '', query) {
      this.startLoading()
      try {
        const result = await axios.get(`promo_codes${query || (id ? `/${id}` : '')}`);
        this.getData(id ? result.data : result.data.rows)
      } catch (e) {
        // dispatch('snackbar/showSnackbar', e, { root: true });
      } finally {
        this.finishLoading()
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`/promo_codes/${id}`);
        this.showNotification('Users has been deleted', 'success');
        await this.fetch()
      } catch (e) {
        console.log('deleteItem error', e)
        // dispatch('snackbar/showSnackbar', e, { root: true });
      }
    },
    async newItem(payload) {
      this.startLoading();
      try {
        const result = await axios.post('/promo_codes', { data: payload });
        this.showNotification('Promo_codes has been created', 'success');
        this.getData(result.data)
      } catch (e) {
        console.log(e)
        // dispatch('snackbar/showSnackbar', e, { root: true });
      } finally {
        this.finishLoading()
      }
    },
    async edit(payload) {
      this.startLoading();
      try {
        const result = await axios.put(`/promo_codes/${payload.id}`, {id: payload.id, data: payload.data})
        // 
        this.showNotification('Promo_codes has been updated', 'success');
        this.getData(result.data)
      } catch (e) {
        this.showNotification(e, 'error');
      } finally {
        this.finishLoading()
      }
    },

            async searchProducts(val) {
              try {
                if (val) {
                  const result = await axios(
                    `/products/autocomplete?query=${val}&limit=100`,
                  );
                  this.setProducts(result.data);
                } else {
                  const result = await axios(`/products/autocomplete?limit=100`);
                  this.setProducts(result.data);
                }
              } catch (e) {
                this.showNotification(e, 'error')
                this.setProducts([]);
              }
            },

    startLoading() {
      this.loading = false;
    },
    getData(payload) {
      this.data = payload;
    },
    finishLoading() {
      this.loading = false;
    },
    showNotification(payload, type) {
      this.notify.showNotification = true
      this.notify.textNotification = payload
      this.notify.typeNotification = type
    },
    hideNotification() {
      this.notify.showNotification = false
      this.notify.textNotification = ''
    },

        setProducts(payload) {
            this.searchResultProducts = payload
        },

  }
})
