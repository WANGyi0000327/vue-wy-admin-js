<script setup lang="ts">
import { compareObjects, deepClone } from "@iceywu/utils";
import { type PlusColumn, PlusForm } from "plus-pro-components";
import { ref } from "vue";
// https://plus-pro-components.com/components/search.html
import "plus-pro-components/es/components/search/style/css";

const props = defineProps({
  formInline: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(["handleSubmit", "handleSubmitError"]);
const newFormInline = ref(deepClone(props.formInline));
const columns: PlusColumn[] = [
  {
    label: "文件名称",
    prop: "name"
  },
  {
    label: "文件MD5",
    prop: "fileMd5"
  },
  {
    label: "文件blurhash",
    prop: "blurhash",
    labelWidth: "fit-content"
  },
  {
    label: "地址",
    prop: "url",
    labelWidth: "fit-content"
  }
];

const handleSubmit = values => {
  console.log(values, "Submit");
  const changeData = compareObjects(props.formInline, values);
  // if (Object.keys(changeData).length === 0) {
  //   return;
  // }
  emit("handleSubmit", changeData);
};
const handleSubmitError = (err: any) => {
  console.log(err, "err");
  emit("handleSubmitError", err);
};
</script>

<template>
  <PlusForm
    v-model="newFormInline"
    :columns="columns"
    label-width="80"
    label-position="right"
    @submit="handleSubmit"
    @submit-error="handleSubmitError"
  />
</template>
