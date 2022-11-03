<script setup>
import { ref, reactive, onBeforeMount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { notify } from "@kyvg/vue3-notification";
import Editor from '@tinymce/tinymce-vue';
import dataFormatter from '@/helpers/dataFormatter';

const router = useRouter();
const route = useRoute();
const ordersStore = useOrdersStore()

const titleStack = ref(['Admin', 'Orders'])
const notification = computed(() => ordersStore.notify)

        const optionsProduct = computed(() => ordersStore.searchResultProduct);

        const optionsUser = computed(() => ordersStore.searchResultUser);

const form = reactive({

      orderDate: '',

      product: '',

      user: '',

      amount: '',

      status: false,

})

const ordersItem = computed(() => ordersStore.data);

const submit = async () => {
  try {

            form.product = form.product?.id;

            form.user = form.user?.id;

    await ordersStore.edit({id: route.params.id, data: {...form} })
    router.push('/orders');
  } catch (e) {
    console.log(e);
  }
}

onBeforeMount(async () => {
  try {

  await searchProduct();

  await searchUser();

    await ordersStore.fetch(route.params.id)
    formatData();
  } catch (e) {
    console.log(e)
    ordersStore.showNotification(e, 'error');
  }
})

    async function searchProduct(val) {
      await ordersStore.searchProduct(val);
    }

    async function searchUser(val) {
      await ordersStore.searchUser(val);
    }

const formatData = () => {

    form.orderDate = dataFormatter.dateTimeFormatter(ordersItem.value.orderDate)

    form.product = dataFormatter.productsOneListFormatterEdit(ordersItem.value.product)

    form.user = dataFormatter.usersOneListFormatterEdit(ordersItem.value.user)

    form.amount = ordersItem.value.amount

    form.status = ordersItem.value.status

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

const reset = () => {
  formatData();
}

const cancel = () => {
  router.push('/orders')
}

</script>

<template>
  <SectionTitleBar :title-stack="titleStack" />
  <SectionHeroBar>Edit Orders</SectionHeroBar>

  <SectionMain>
    <CardBox
      title="Edit Orders"
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
