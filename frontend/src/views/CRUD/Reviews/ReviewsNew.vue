<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
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
import Editor from '@tinymce/tinymce-vue'
import { notify } from "@kyvg/vue3-notification";

const reviewsStore = useReviewsStore()
const router = useRouter();

const notification = computed(() => reviewsStore.notify)
const titleStack = ref(['Admin', 'Reviews'])

        const optionsProduct = computed(() => reviewsStore.searchResultProduct);

        const optionsUser = computed(() => reviewsStore.searchResultUser);

const form = reactive({

    body: '',

      rating: '',

      product: '',

      user: '',

})

onBeforeMount(async () => {

  await searchProduct();

  await searchUser();

})

const submit = async () => {
  try {

            form.product = form.product.id;

            form.user = form.user.id;

    await reviewsStore.newItem({ ...form })
    router.push('/reviews');
  } catch (e) {
    console.log(e);
  }
}

const reset = () => {

      form.body = '';

        form.rating = '';

        form.product = '';

        form.user = '';

}

const cancel = () => {
  router.push('/users')
}

    async function searchProduct(val) {
      await reviewsStore.searchProduct(val);
    }

    async function searchUser(val) {
      await reviewsStore.searchUser(val);
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

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>New Reviews</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="New Reviews"
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
