<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePromo_codesStore } from "@/stores/Promo_codes/promo_codes";
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
const promo_codesStore = usePromo_codesStore()

const titleStack = ref(['Admin', 'Promo_codes'])
const notification = computed(() => promo_codesStore.notify)

        const optionsProducts = computed(() => promo_codesStore.searchResultProducts);

const form = reactive({

    code: '',

    discount: '',

      products: [],

})

const promo_codesItem = computed(() => promo_codesStore.data);

const submit = async () => {
  try {

            form.products = form.products.map(item => item.id);

    await promo_codesStore.edit({id: route.params.id, data: {...form} })
    router.push('/promo_codes');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

  await searchProducts();

    await promo_codesStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    promo_codesStore.showNotification(e, 'error');
  }
})

    async function searchProducts(val) {
      await promo_codesStore.searchProducts(val);
    }

const formatData = () => {

    form.code = promo_codesItem.value.code

    form.discount = promo_codesItem.value.discount

    form.products = dataFormatter.productsManyListFormatterEdit(promo_codesItem.value.products)

}

watch(() => promo_codesStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Promo_codes notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    promo_codesStore.hideNotification()
  }
});

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/promo_codes')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Promo_codes</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Promo_codes"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Code"
    >
      <FormControl
        v-model="form.code"
        placeholder="Your Code"
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
        label="Products"
      >
        <v-select
          v-model="form.products"
          :options="optionsProducts"
          multiple
          @input="searchProducts($event.target.value)"
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
