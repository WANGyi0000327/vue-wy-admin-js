<script setup>
import { useNav } from "@/layout/hooks/useNav";
import MenuFold from "@iconify-icons/ri/menu-fold-fill";
import { useGlobal } from "@pureadmin/utils";
import { computed } from "vue";

import { useI18n } from "vue-i18n";

// interface Props {
//   isActive: boolean;
// }

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
  // 其他 props 的定义
});

const emit = defineEmits(["toggleClick"]);
const { t } = useI18n();
const { tooltipEffect } = useNav();

const iconClass = computed(() => {
  return [
    "ml-4",
    "mb-1",
    "w-[16px]",
    "h-[16px]",
    "inline-block",
    "align-middle",
    "cursor-pointer",
    "duration-[100ms]"
  ];
});

const { $storage } = useGlobal();
const themeColor = computed(() => $storage.layout?.themeColor);

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div class="left-collapse">
    <IconifyIconOffline
      v-tippy="{
        content: isActive
          ? t('buttons.pureClickCollapse')
          : t('buttons.pureClickExpand'),
        theme: tooltipEffect,
        hideOnClick: 'toggle',
        placement: 'right'
      }"
      :icon="MenuFold"
      :class="[iconClass, themeColor === 'light' ? '' : 'text-primary']"
      :style="{ transform: isActive ? 'none' : 'rotateY(180deg)' }"
      @click="toggleClick"
    />
  </div>
</template>

<style lang="scss" scoped>
.left-collapse {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 0 6px -3px var(--el-color-primary);
}
</style>
