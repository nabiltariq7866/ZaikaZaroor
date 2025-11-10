import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  App,
  Spin,
  Card,
  Image,
  Descriptions,
  Empty,
  Popconfirm,
  Table,
  Space,
  Select,
  InputNumber,
  Tag,
} from "antd";
import { Plus, Edit, UploadCloud, Trash2, Eye } from "lucide-react";
import { useApi } from "../../context/ApiContext";
import { Link } from "react-router-dom";

const { Dragger } = Upload;
const { Option } = Select;

// --- Category Options (Aapke schema se) ---
const categories = [
  "Snacks",
  "Main Course",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "Others",
];

// --- Modal Form Component (Add/Edit ke liye) ---
const ItemFormModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  initialData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        image: initialData.image
          ? [
              {
                uid: "-1",
                name: "Current Image",
                status: "done",
                url: initialData.image,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFormSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("price", values.price);

    if (values.image && values.image[0] && values.image[0].originFileObj) {
      formData.append("image", values.image[0].originFileObj); // Backend 'image' expect kar raha hai
    }
    onSubmit(formData);
  };

  const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

  return (
    <Modal
      title={initialData ? "Edit Item" : "Add New Item"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
          <Input placeholder="e.g., Chicken Burger" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (PKR)"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={0}
            placeholder="e.g., 500"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select a category">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label="Item Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: !initialData, message: "Please upload an image" },
          ]}
        >
          <Dragger
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onRemove={() => form.setFieldsValue({ image: [] })}
          >
            <p className="ant-upload-drag-icon">
              <UploadCloud />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="bg-orange-600"
          >
            {initialData ? "Save Changes" : "Create Item"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// --- Main Page Component ---
const OwnerFoodItemPage = () => {
  const {
    items,
    getMyItems,
    createItem,
    updateItem,
    deleteItem,
    loading,
    getMyShop,
    shop,
  } = useApi();
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { modal } = App.useApp();

  useEffect(() => {
    if (!shop) {
      getMyShop();
    }
    getMyItems();
  }, []);

  const handleModalSubmit = async (formData) => {
    let result;
    if (selectedItem) {
      result = await updateItem(selectedItem._id, formData);
    } else {
      result = await createItem(formData);
    }
    if (result.success) {
      setIsFormModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsFormModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    setIsFormModalVisible(true);
  };

  const handleView = (record) => {
    setSelectedItem(record);
    setIsViewModalVisible(true);
  };

  const handleDelete = (record) => {
    modal.confirm({
      title: `Delete "${record.name}"?`,
      content:
        "Are you sure you want to delete this item? This cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await deleteItem(record._id);
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <Image
          src={url}
          alt="Item"
          width={60}
          height={60}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Price (PKR)",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rs. ${price.toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<Eye size={16} />} onClick={() => handleView(record)}>
            View
          </Button>
          <Button icon={<Edit size={16} />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => handleDelete(record)}
            okText="Yes, Delete"
            cancelText="No"
          >
            <Button danger icon={<Trash2 size={16} />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isLoading = loading.getMyItems;

  return (
    <Spin spinning={isLoading} tip="Loading items...">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Food Items</h1>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={handleAdd}
          className="bg-orange-600"
          disabled={!shop} // Agar shop nahi, toh item add nahi kar sakte
        >
          Add New Item
        </Button>
      </div>

      {!shop && !isLoading && (
        <Empty
          description={
            <span>You must create a shop first before adding items.</span>
          }
        >
          <Link to="/owner/my-shop">
            <Button type="primary" className="bg-orange-600">
              Create Shop Now
            </Button>
          </Link>
        </Empty>
      )}

      {shop && (
        <Table
          dataSource={items}
          columns={columns}
          rowKey="_id"
          loading={
            loading.createItem || loading.updateItem || loading.deleteItem
          }
        />
      )}

      {/* --- Add/Edit Modal --- */}
      {isFormModalVisible && (
        <ItemFormModal
          visible={isFormModalVisible}
          onCancel={() => {
            setIsFormModalVisible(false);
            setSelectedItem(null);
          }}
          onSubmit={handleModalSubmit}
          loading={loading.createItem || loading.updateItem}
          initialData={selectedItem}
        />
      )}

      {/* --- View Modal --- */}
      {selectedItem && (
        <Modal
          title="Item Details"
          open={isViewModalVisible}
          onCancel={() => {
            setIsViewModalVisible(false);
            setSelectedItem(null);
          }}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Item Name">
              {selectedItem.name}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              Rs. {selectedItem.price.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {selectedItem.category}
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                width={200}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Shop (Populated)">
              {/* Yeh tab hi dikhega agar 'shop' populated hai */}
              {selectedItem.shop?.name || "Shop details not loaded"}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </Spin>
  );
};

export default OwnerFoodItemPage;
