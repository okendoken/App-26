<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from "@/stores/Orders/orders";
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

const ordersStore = useOrdersStore()
const router = useRouter();

const notification = computed(() => ordersStore.notify)
const titleStack = ref(['Admin', 'Orders'])

        const optionsProduct = computed(() => ordersStore.searchResultProduct);

        const optionsUser = computed(() => ordersStore.searchResultUser);

const form = reactive({

      orderDate: '',

      product: '',

      user: '',

      amount: '',

      status: false,

})

onBeforeMount(async () => {

  await searchProduct();

  await searchUser();

})

const submit = async () => {
  try {

            form.product = form.product.id;

            form.user = form.user.id;

    await ordersStore.newItem({ ...form })
    router.push('/orders');
  } catch (e) {
    console.log(e);
  }
}

const reset = () => {

        form.orderDate = '';

        form.product = '';

        form.user = '';

        form.amount = '';

        form.status = false;

}

const cancel = () => {
  router.push('/users')
}

    async function searchProduct(val) {
      await ordersStore.searchProduct(val);
    }

    async function searchUser(val) {
      await ordersStore.searchUser(val);
    }

watch(() => ordersStore.notify.showNotification, (newValue, oldValue) => {
  if(newValue){
    notify({
      title: "Orders notification",
      text: notification.value.textNotification,
      type: notification.value.typeNotification,
    });
    ordersStore.hideNotification()
  }
});

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>New Orders</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="New Orders"
      form
      @submit.prevent="submit"
    >

    <FormField
      label="Order Date"
    >
      <FormControl
        type="datetime-local"
        v-model="form.orderDate"
        placeholder="Your Order Date"
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

    <FormField
      label="Amount"
    >
      <FormControl
        type="number"
        v-model="form.amount"
        placeholder="Your Amount"
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

        :options="{ 'in cart': 'in cart', 'bought': 'bought', }"

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
