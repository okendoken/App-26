<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReviewsStore } from "@/stores/Reviews/reviews";
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
const reviewsStore = useReviewsStore()

const titleStack = ref(['Admin', 'Reviews'])
const notification = computed(() => reviewsStore.notify)

        const optionsProduct = computed(() => reviewsStore.searchResultProduct);

        const optionsUser = computed(() => reviewsStore.searchResultUser);

const form = reactive({

    body: [''],

      rating: '',

      product: '',

      user: '',

})

const reviewsItem = computed(() => reviewsStore.data);

const submit = async () => {
  try {

            form.product = form.product?.id;

            form.user = form.user?.id;

    await reviewsStore.edit({id: route.params.id, data: {...form} })
    router.push('/reviews');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

  await searchProduct();

  await searchUser();

    await reviewsStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    reviewsStore.showNotification(e, 'error');
  }
})

    async function searchProduct(val) {
      await reviewsStore.searchProduct(val);
    }

    async function searchUser(val) {
      await reviewsStore.searchUser(val);
    }

const formatData = () => {

    form.body = reviewsItem.value.body

    form.rating = reviewsItem.value.rating

    form.product = dataFormatter.productsOneListFormatterEdit(reviewsItem.value.product)

    form.user = dataFormatter.usersOneListFormatterEdit(reviewsItem.value.user)

}

watch(() => reviewsStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Reviews notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    reviewsStore.hideNotification()
  }
});

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/reviews')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Reviews</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Reviews"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Body"
    >
      <FormControl
        v-model="form.body"
        type="textarea"
        placeholder="Your Body"
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
      label="Product"
    >
      <v-select
        v-model="form.product"
        :options="optionsProduct"
        @input="searchProduct($event.target.value)"
      />
  </FormField>

  <FormField
      label="User"
    >
      <v-select
        v-model="form.user"
        :options="optionsUser"
        @input="searchUser($event.target.value)"
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
