<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    fileMd5: "",
    blurhash: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="文件名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入文件名称"
      />
    </el-form-item>

    <el-form-item label="文件MD5" prop="code">
      <el-input
        v-model="newFormInline.fileMd5"
        clearable
        placeholder="请输入文件MD5"
      />
    </el-form-item>

    <el-form-item label="文件blurhash">
      <el-input
        v-model="newFormInline.blurhash"
        placeholder="请输入文件blurhash"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
