<script setup>
import MenuFold from "@iconify-icons/ri/menu-fold-fill";
import MenuUnfold from "@iconify-icons/ri/menu-unfold-fill";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
  // 其他 props 的定义
});

const emit = defineEmits(["toggleClick"]);

const { t } = useI18n();

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div
    class="px-3 mr-1 navbar-bg-hover"
    :title="
      isActive ? t('buttons.pureClickCollapse') : t('buttons.pureClickExpand')
    "
    @click="toggleClick"
  >
    <IconifyIconOffline
      :icon="isActive ? MenuFold : MenuUnfold"
      class="inline-block align-middle hover:text-primary dark:hover:!text-white"
    />
  </div>
</template>
