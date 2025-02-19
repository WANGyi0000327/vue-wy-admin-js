<script setup lang="ts">
import { type PlusColumn, PlusSearch } from "plus-pro-components";
// https://plus-pro-components.com/components/search.html
import "plus-pro-components/es/components/search/style/css";
const emit = defineEmits(["handleSearch", "handleRest"]);
const modelVal = defineModel({
  type: Object,
  default: {
    name: "",
    fileMd5: "",
    blurhash: "",
    page: 1,
    size: 10,
    sort: "createdAt,desc"
  }
});
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
  }
];

const handleChange = (values: any) => {
  console.log(values, "change");
};
const handleSearch = (values: any) => {
  console.log(values, "search");
  emit("handleSearch", values);
};
const handleRest = () => {
  console.log("handleRest");

  emit("handleRest");
};
</script>

<template>
  <PlusSearch
    v-model="modelVal"
    :columns="columns"
    :show-number="2"
    label-width="80"
    label-position="right"
    @change="handleChange"
    @search="handleSearch"
    @reset="handleRest"
  />
</template>
