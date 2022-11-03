import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductsStore = defineStore('products', {
  state: () => ({
    data: [],
    loading: false,
    notify: {
      showNotification: false,
      textNotification: '',
      typeNotification: 'warn',
    },

            searchResultCategories: [],

            searchResultMoreProducts: [],

  }),
  actions: {
    async fetch(id = '', query) {
      this.startLoading()
      try {
        const result = await axios.get(`products${query || (id ? `/${id}` : '')}`);
        this.getData(id ? result.data : result.data.rows)
      } catch (e) {
        // dispatch('snackbar/showSnackbar', e, { root: true });
      } finally {
        this.finishLoading()
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`/products/${id}`);
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
        const result = await axios.post('/products', { data: payload });
        this.showNotification('Products has been created', 'success');
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
        const result = await axios.put(`/products/${payload.id}`, {id: payload.id, data: payload.data})
        // 
        this.showNotification('Products has been updated', 'success');
        this.getData(result.data)
      } catch (e) {
        this.showNotification(e, 'error');
      } finally {
        this.finishLoading()
      }
    },

            async searchCategories(val) {
              try {
                if (val) {
                  const result = await axios(
                    `/categories/autocomplete?query=${val}&limit=100`,
                  );
                  this.setCategories(result.data);
                } else {
                  const result = await axios(`/categories/autocomplete?limit=100`);
                  this.setCategories(result.data);
                }
              } catch (e) {
                this.showNotification(e, 'error')
                this.setCategories([]);
              }
            },

            async searchMoreProducts(val) {
              try {
                if (val) {
                  const result = await axios(
                    `/products/autocomplete?query=${val}&limit=100`,
                  );
                  this.setMoreProducts(result.data);
                } else {
                  const result = await axios(`/products/autocomplete?limit=100`);
                  this.setMoreProducts(result.data);
                }
              } catch (e) {
                this.showNotification(e, 'error')
                this.setMoreProducts([]);
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

        setCategories(payload) {
            this.searchResultCategories = payload
        },

        setMoreProducts(payload) {
            this.searchResultMoreProducts = payload
        },

  }
})
