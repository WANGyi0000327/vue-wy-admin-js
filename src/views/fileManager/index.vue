<script setup lang="ts">
import EmptyData from "@/components/Empty/index.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import Delete from "@iconify-icons/ep/delete";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { computed } from "vue";

import SearchCom from "./components/Search.vue";

import { useRole } from "./utils/hook";

defineOptions({
  name: "Role"
});

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  // buttonClass,
  onSearch,
  resetForm,
  openDialog,
  handleMenu,
  handleDelete,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  uploadFileFunc1,
  uploadFileFunc2,
  uploadObj,
  handleFileUpdate
} = useRole();
// 使用computed
const topVal = computed(() => {
  return `${38 - uploadObj.value.percent * 68 * 0.01}px`;
});
const leftVal = computed(() => {
  return `${70 - uploadObj.value.percent * 100 * 0.01}px`;
});
// 按钮文字颜色
const buttonFontColor = computed(() => {
  return uploadObj.value.percent > 40 ? "#fff" : "#560bad";
});
// 优化为style
const uploadButtonText = computed(() => {
  if (uploadObj.value.percent === 0) {
    return "上传文件";
  } else if (uploadObj.value.percent === 100) {
    return "上传成功";
  } else {
    return `上传进度${uploadObj.value.percent}%`;
  }
});
</script>

<template>
  <div class="main">
    <SearchCom
      v-model="form"
      @handle-search="onSearch"
      @handle-rest="resetForm"
    />

    <PureTableBar
      title="角色列表（仅演示，操作后不生效）"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增角色
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="uploadFileFunc1()"
        >
          文件上传-分片
        </el-button>

        <button class="upload-button" @click="uploadFileFunc2()">
          {{ uploadButtonText }}
        </button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-popconfirm
              :title="`是否确认删除文件名称为${row.name}的这条数据`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleFileUpdate(row)"
            >
              更新
            </el-button>
          </template>
          <template #empty>
            <div class="mt-10">
              <EmptyData title="暂无数据" />
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

<style scoped lang="scss">
/* stylelint-disable */
.upload-button {
  --color: #560bad;

  position: relative;
  z-index: 1;
  display: inline-block;
  width: 150px;
  height: 32px;
  margin-left: 20px;
  overflow: hidden;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;

  color: v-bind("buttonFontColor");
  border: 2px solid var(--color);
  border-radius: 6px;
  transition: color 0.5s;

  &::before {
    position: absolute;
    //top: 100%;
    //left: 100%;
    top: 38px;
    top: v-bind("topVal");
    left: 70px;
    left: v-bind("leftVal");
    z-index: -1;
    width: 200px;
    height: 150px;
    content: "";
    background: var(--color);
    border-radius: 50%;
    transition: all 0.7s;
  }

  // &:hover {
  //   &::before {
  //     top: -30px;
  //     left: -30px;
  //   }
  // }

  &:active::before {
    background: #3a0ca3;
    transition: background 0s;
  }
}
/* stylelint-enable */
</style>
