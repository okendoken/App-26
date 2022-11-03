<script setup>
import { computed, ref } from 'vue'
import { useProductsStore } from "@/stores/Products/products";
import { mdiEye, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import dataFormatter from '@/helpers/dataFormatter';
import { useRouter } from 'vue-router';
import FormControl from '@/components/FormControl.vue';

const $router = useRouter();

const props = defineProps({
  checkable: Boolean,
  sortTitle: String,
  sortDirection: String
})

const emit = defineEmits(['sort']);
/* Fetch data */
const productsStore = useProductsStore()
productsStore.fetch()

/* Delete item */
const deleteItem = () => {
  productsStore.deleteItem(currentId.value)
}

const items = computed(() => productsStore.data)

const headers = [

{ text: 'Title', value: 'title'},
{ text: 'Image', value: 'image'},
{ text: 'Price', value: 'price'},
{ text: 'Discount', value: 'discount'},
{ text: 'Description', value: 'description'},
{ text: 'Categories', value: 'categories'},
{ text: 'More Products', value: 'moreProducts'},
{ text: 'Rating', value: 'rating'},
{ text: 'Status', value: 'status'},]
const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const currentId = ref(0);

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const itemsPaginated = computed(
  () => items.value && items.value.length && items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach(item => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
  }
}

const showModal = (client) => {
  currentId.value = client.id
  isModalDangerActive.value = true
}

const sort = (title) => {
  let sortTitle = title;
  let sortDirection = '';
  if (props.sortTitle !== title) {
    sortDirection = 'asc';
  } else {
    if (props.sortDirection === 'asc') {
      sortDirection = 'desc';
    } else {
      sortDirection = '';
      sortTitle = '';
    }
  }
  emit('sort', {sortTitle, sortDirection});
}

</script>

<template>
  <CardBoxModal
    v-model="isModalActive"
    title="Products modal"
  >
    <ul
      v-for="item in headers"
      :key="item"
    >
      <li>{{ item.text }}</li>
    </ul>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    large-title="Please confirm"
    button="danger"
    has-cancel
    :deleteItem="deleteItem"
  >
    <p>Are you sure you want to delete this item?</p>
  </CardBoxModal>

  <div
    v-if="checkedRows.length"
    class="p-3 bg-gray-100/50 dark:bg-gray-800"
  >
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-gray-700"
    >
      {{ checkedRow[headers[0].value] }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
      <th v-if="checkable" />

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'title' && props.sortDirection]"
        @click="sort('title')"
      >Title</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'image' && props.sortDirection]"
        @click="sort('image')"
      >Image</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'price' && props.sortDirection]"
        @click="sort('price')"
      >Price</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'discount' && props.sortDirection]"
        @click="sort('discount')"
      >Discount</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'description' && props.sortDirection]"
        @click="sort('description')"
      >Description</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'categories' && props.sortDirection]"
        @click="sort('categories')"
      >Categories</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'moreProducts' && props.sortDirection]"
        @click="sort('moreProducts')"
      >More Products</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'rating' && props.sortDirection]"
        @click="sort('rating')"
      >Rating</th>

      <th
        :class="['sortable uppercase text-sm font-normal text-pavitra-600', props.sortTitle === 'status' && props.sortDirection]"
        @click="sort('status')"
      >Status</th>

        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="client in itemsPaginated"
        :key="client.id"
        @click="$router.push(`/products/${client.id}/edit`)"
      >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />

              <td data-label="title">
                {{ client.title }}
              </td>

              <td data-label="image">
                <UserAvatar v-if="!client.image?.length"
                  class="w-10 h-10 md:mr-6"
                />
                <img v-if="client.image.length"
                  class="w-10 h-10 md:mr-6 rounded-full"
                  :src="client.image[0].publicUrl"
                  :alt="client.image[0].name"
                />
              </td>

              <td data-label="price">
                {{ client.price }}
              </td>

              <td data-label="discount">
                {{ client.discount }}
              </td>

              <td data-label="description">
                {{ client.description }}
              </td>

              <td data-label="categories">
                  <span
                    v-for="(i, idx) in dataFormatter.categoriesManyListFormatter(client.categories)"
                    :key="idx + client.categories"
                    class="block"
                  >
                      {{ i }}
                  </span>
              </td>  

              <td data-label="moreProducts">
                  <span
                    v-for="(i, idx) in dataFormatter.productsManyListFormatter(client.moreProducts)"
                    :key="idx + client.moreProducts"
                    class="block"
                  >
                      {{ i }}
                  </span>
              </td>  

              <td data-label="rating">
                {{ client.rating }}
              </td>

              <td data-label="status">
                {{ client.status }}
              </td>

        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons
            type="justify-start lg:justify-end"
            no-wrap
          >
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              :to="`/products/${client.id}/edit`"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click.stop="() => showModal(client)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800"
  >
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      <FormControl class="w-[70px]" type="select" :options="[10, 20, 50, 100]" v-model="perPage"/>
    </BaseLevel>
  </div>
</template>
