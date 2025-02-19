import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";
import { fileDeleteById, fileFindAll, fileUpdateById } from "@/api/files";
import ImgBlurHash from "@/components/ImgBlurHash";
import PreCover from "@/components/Preview/cover.vue";
// import { ElMessageBox } from "element-plus";
// import { usePublicHooks } from "../../hooks";
import { addDialog, closeAllDialog } from "@/components/ReDialog";
import { getFileIcon } from "@/utils/getFileType";
import { requestTo } from "@/utils/http/tool";
// import editForm from "../form.vue";
import { message } from "@/utils/message";
import { uploadFile } from "@/utils/upload";
import { uploadFileBase } from "@/utils/upload/base";

import { useFileDialog } from "@vueuse/core";
import dayjs from "dayjs";
import { h, onMounted, reactive, ref, toRaw } from "vue";
import editForm from "../components/editForm.vue";

export function useRole() {
  const form = reactive({
    name: "",
    fileMd5: "",
    blurhash: "",
    page: 1,
    size: 10,
    sort: "createdAt,desc"
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // const switchLoadMap = ref({});
  // const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "文件编号",
      prop: "id",
      width: 90
    },
    {
      label: "文件名称",
      prop: "name",
      width: 200
    },

    {
      label: "预览",
      prop: "url",
      cellRenderer: ({ row }) => (
        <div class="rounded-md overflow-hidden relative">
          <div
            class="absolute top-1 right-1  text-xl"
            style={{
              backgroundImage: `url(${getFileIcon(row.url)})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "50px",
              height: "40px"
            }}
          >
          </div>
          <PreCover class=" !h-30" data={row} />
        </div>
      ),
      width: 300
    },
    {
      label: "上传人",
      prop: "remark",
      children: [
        {
          label: "用户名称",
          prop: "user",
          cellRenderer: ({ row }) => <el-tag>{row.user.name}</el-tag>
        },
        {
          label: "头像",
          prop: "user",
          cellRenderer: ({ row }) => (
            <ImgBlurHash
              class="rounded-full"
              v-preview={{
                url: row?.user?.avatar,
                type: "image"
              }}
              src={row.user.avatar}
            />
          )
        }
      ]
    },
    {
      label: "文件类型",
      prop: "type",
      minWidth: 130
    },
    {
      label: "blurhash",
      prop: "blurhash",
      minWidth: 130,
      formatter: ({ blurhash }) => blurhash ?? "暂无不支持",
      cellRenderer: ({ row }) => (
        // <div v-copy={row.blurhash ?? " "}>{row.blurhash}</div>
        <div>{row.blurhash}</div>
      )
    },
    {
      label: "fileMd5",
      prop: "fileMd5",
      minWidth: 130
    },
    {
      label: "文件大小",
      prop: "size",
      minWidth: 130,
      formatter: ({ size }) =>
        size ? `${(size / 1024 / 1024).toFixed(2)}MB` : ""
    },
    {
      label: "oss路径",
      prop: "path",
      minWidth: 130
    },

    {
      label: "创建时间",
      minWidth: 180,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  async function handleDelete(row) {
    const params = {
      id: row.id,
      ossDlelete: true
    };
    const [_, data] = await requestTo(fileDeleteById(params));
    if (data) {
      message(`删除成功`, { type: "success" });
      onSearch();
    } else {
      message(`删除失败`, { type: "error" });
    }
  }
  async function handleFileUpdate(row) {
    addDialog({
      title: `修改文件`,
      props: {
        formInline: row
      },
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          onHandleSubmit: async changeData => {
            console.log("🐳-----changeData-----", changeData);
            const params = {
              id: row.id,
              ...changeData
            };
            const [_, data] = await requestTo(fileUpdateById(params));
            if (data) {
              message(`更新成功`, { type: "success" });
              onSearch();
            } else {
              message(`更新失败`, { type: "error" });
            }
            closeAllDialog();
          }
        })
    });
  }

  function handleSizeChange(val: number) {}

  function handleCurrentChange(val: number) {
    form.page = val;
    onSearch();
  }

  function handleSelectionChange(val) {}

  async function onSearch() {
    loading.value = true;
    const [err, result] = await requestTo(fileFindAll(toRaw(form)));
    const { data = [], meta = {} } = result || {};
    dataList.value = data;
    pagination.total = meta.totalElements;
    pagination.pageSize = form.size;
    pagination.currentPage = form.page;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          fileMd5: row?.fileMd5 ?? "",
          blurhash: row?.blurhash ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用编辑接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  function handleMenu() {
    message("等菜单管理页面开发后完善");
  }
  const { open: uploadFileFunc1, onChange: onChange1 } = useFileDialog({
    accept: "image/*,video/*"
  });
  const upPercent = ref(0);
  const showUploadLoading = ref(false);
  onChange1(async file => {
    // loading
    upPercent.value = 0;
    showUploadLoading.value = true;
    for (let i = 0; i < file.length; i++) {
      const { code, msg, result } = (await uploadFile(file[i], progress => {
        const { percent } = progress;
        upPercent.value = percent;
      })) as any;
      if (code === 200) {
        onSearch();
        message("文件分片上传成功");
      } else {
        message(msg);
      }
    }
    showUploadLoading.value = false;
  });
  const { open: uploadFileFunc2, onChange: onChange2 } = useFileDialog({
    accept: "image/*,video/*",
    reset: true
  });
  const uploadObj = ref({
    percent: 0
  });
  onChange2(async file => {
    for (let i = 0; i < file.length; i++) {
      const { code, msg, result } = ({} = (await uploadFileBase(
        file[i],
        progress => {
          uploadObj.value.percent = progress;
        }
      )) as any);
      if (code === 200) {
        onSearch();
        setTimeout(() => {
          uploadObj.value.percent = 0;
        }, 1000);
        message("文件不分片上传成功");
      } else {
        message(msg);
      }
    }
  });

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(() => {
    onSearch();
  });

  return {
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
  };
}
