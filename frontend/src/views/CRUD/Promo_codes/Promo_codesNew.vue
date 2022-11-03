<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
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
import Editor from '@tinymce/tinymce-vue'
import { notify } from "@kyvg/vue3-notification";

const promo_codesStore = usePromo_codesStore()
const router = useRouter();

const notification = computed(() => promo_codesStore.notify)
const titleStack = ref(['Admin', 'Promo_codes'])

        const optionsProducts = computed(() => promo_codesStore.searchResultProducts);

const form = reactive({

      code: '',

      discount: '',

      products: [],

})

onBeforeMount(async () => {

  await searchProducts();

})

const submit = async () => {
  try {

            form.products = form.products.map(item => item.id);

    await promo_codesStore.newItem({ ...form })
    router.push('/promo_codes');
  } catch (e) {
    console.log(e);
  }
}

const reset = () => {

        form.code = '';

        form.discount = '';

        form.products = [];

}

const cancel = () => {
  router.push('/users')
}

    async function searchProducts(val) {
      await promo_codesStore.searchProducts(val);
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

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>New Promo_codes</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="New Promo_codes"
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
        type="reset"
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
