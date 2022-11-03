<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from "@/stores/Products/products";
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleBar from '@/components/SectionTitleBar.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioPicker from '@/components/FormCheckRadioPicker.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import SectionHeroBar from '@/components/SectionHeroBar.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { notify } from "@kyvg/vue3-notification";
import Editor from '@tinymce/tinymce-vue';
import dataFormatter from '@/helpers/dataFormatter';

const router = useRouter();
const route = useRoute();
const productsStore = useProductsStore()

const titleStack = ref(['Admin', 'Products'])
const notification = computed(() => productsStore.notify)

        const optionsCategories = computed(() => productsStore.searchResultCategories);

        const optionsMoreProducts = computed(() => productsStore.searchResultMoreProducts);

const form = reactive({

    title: '',

      image: [],

    price: '',

    discount: '',

    description: [''],

      categories: [],

      moreProducts: [],

      rating: '',

      status: false,

})

const productsItem = computed(() => productsStore.data);

const submit = async () => {
  try {

            form.categories = form.categories.map(item => item.id);

            form.moreProducts = form.moreProducts.map(item => item.id);

    await productsStore.edit({id: route.params.id, data: {...form} })
    router.push('/products');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

  await searchCategories();

  await searchMoreProducts();

    await productsStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    productsStore.showNotification(e, 'error');
  }
})

    async function searchCategories(val) {
      await productsStore.searchCategories(val);
    }

    async function searchMoreProducts(val) {
      await productsStore.searchMoreProducts(val);
    }

const formatData = () => {

    form.title = productsItem.value.title

    form.image = productsItem.value.image

    form.price = productsItem.value.price

    form.discount = productsItem.value.discount

    form.description = productsItem.value.description

    form.categories = dataFormatter.categoriesManyListFormatterEdit(productsItem.value.categories)

    form.moreProducts = dataFormatter.productsManyListFormatterEdit(productsItem.value.moreProducts)

    form.rating = productsItem.value.rating

    form.status = productsItem.value.status

}

watch(() => productsStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Products notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    productsStore.hideNotification()
  }
});

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/products')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Products</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Products"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Title"
    >
      <FormControl
        v-model="form.title"
        placeholder="Your Title"
        />
    </FormField>

      <FormField
        label="Image"
      >
        <FormFilePicker v-model="form.image" url="products/image"/>
      </FormField>

    <FormField
      label="Price"
    >
      <FormControl
        type="number"
        v-model="form.price"
        placeholder="Your Price"
      />
    </FormField>

    <FormField
      label="Discount"
    >
      <FormControl
        type="number"
        v-model="form.discount"
        placeholder="Your Discount"
      />
    </FormField>

    <FormField
      label="Description"
    >
      <FormControl
        v-model="form.description"
        type="textarea"
        placeholder="Your Description"
        />
    </FormField>

    <FormField
        label="Categories"
      >
        <v-select
          v-model="form.categories"
          :options="optionsCategories"
          multiple
          @input="searchCategories($event.target.value)"
        />
    </FormField>

    <FormField
        label="More Products"
      >
        <v-select
          v-model="form.moreProducts"
          :options="optionsMoreProducts"
          multiple
          @input="searchMoreProducts($event.target.value)"
        />
    </FormField>

    <FormField
      label="Rating"
    >
      <FormControl
        type="number"
        v-model="form.rating"
        placeholder="Your Rating"
      />
    </FormField>

    <FormField
      label="Status"
      wrap-body
    >
      <FormCheckRadioPicker
        v-model="form.status"
        name="status"
        type="radio"

        :options="{ 'in stock': 'in stock', 'out of stock': 'out of stock', }"

      />
    </FormField>

    <BaseDivider />

    <BaseButtons>
      <BaseButton
        type="submit"
        color="info"
        label="Submit"
      />
      <BaseButton
        type="button"
        color="info"
        outline
        label="Reset"
        @click="reset"
      />
      <BaseButton
        type="cancel"
        color="danger"
        outline
        label="Cancel"
        @click="cancel"
      />
    </BaseButtons>
  </CardBox>
</SectionMain>

</template>
