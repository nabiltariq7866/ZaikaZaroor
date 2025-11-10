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
} from "antd";
import { Plus, Edit, UploadCloud, Trash2 } from "lucide-react";
import { useApi } from "../../context/ApiContext";

const { Dragger } = Upload;

// --- Modal Form Component ---
const ShopFormModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  initialData,
}) => {
  const [form] = Form.useForm();
  
  // (FIX 1: Local fileList state ki zaroorat nahi, Form handle karega)
  // const [fileList, setFileList] = useState([]); 

  useEffect(() => {
    if (initialData) {
      // (FIX 2: 'image' ko bhi form state mein set karein)
      form.setFieldsValue({
        name: initialData.name,
        address: initialData.address,
        city: initialData.city,
        state: initialData.state,
        // Dragger 'fileList' (Array) expect karta hai
        image: initialData.image ? [
          {
            uid: "-1",
            name: "Current Image",
            status: "done",
            url: initialData.image,
          },
        ] : [],
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFormSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("address", values.address);

    if (values.image && values.image[0] && values.image[0].originFileObj) {
      formData.append("image", values.image[0].originFileObj);
    }
    onSubmit(formData);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const beforeUpload = (file) => {
    // setFileList([file]); // (Local state ki zaroorat nahi)
    return false; // Automatically upload na karein
  };

  return (
    <Modal
      title={initialData ? "Edit Your Shop" : "Create Your Shop"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="name"
          label="Shop Name"
          rules={[{ required: true, message: "Please enter the shop name" }]}
        >
          <Input placeholder="e.g., ZaikaZaroor Lahore" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input placeholder="e.g., 123, Block C, Model Town" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: "Please enter the city" }]}
        >
          <Input placeholder="e.g., Lahore" />
        </Form.Item>

        <Form.Item
          name="state"
          label="State/Province"
          rules={[{ required: true, message: "Please enter the state" }]}
        >
          <Input placeholder="e.g., Punjab" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Shop Image"
          valuePropName="fileList" // Yeh Form se 'fileList' prop Dragger ko dega
          getValueFromEvent={normFile}
          rules={[
            { required: !initialData, message: "Please upload an image" },
          ]}
        >
          <Dragger
            listType="picture"
            maxCount={1}
            // (FIX 3: fileList prop hatayein, ab Form.Item control kar raha hai)
            // fileList={fileList} 
            beforeUpload={beforeUpload}
            onRemove={() => {
              form.setFieldsValue({ image: [] }); // Form ki value clear karein
            }}
          >
            <p className="ant-upload-drag-icon">
              <UploadCloud />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">(Required)</p>
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
            {initialData ? "Save Changes" : "Create Shop"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// --- Main Page Component ---
const OwnerMyShopPage = () => {
  // --- YAHAN FIX KIYA HAI ---
  // 'shop' ko context se NAHI nikalna
  const { getMyShop,shop, createShop, updateShop, deleteShop, loading } =
    useApi();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { modal } = App.useApp();


  useEffect(() => {
    getMyShop();
  }, []); 

  const handleModalSubmit = async (formData) => {
    let result;
    if (shop) {
      result = await updateShop(shop._id, formData);
    } else {
      result = await createShop(formData);
    }

    if (result.success) {
      setIsModalVisible(false);
    }
  };

  const handleDelete = () => {
    if (!shop) return;

    modal.confirm({
      title: "Are you sure you want to delete this shop?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        const result = await deleteShop(shop._id);
      },
    });
  };

  const isLoading = loading.getMyShop;

  return (
    <Spin spinning={isLoading} tip="Loading shop...">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Shop</h1>
        {shop ? (
          <Button
            type="primary"
            icon={<Edit size={16} />}
            onClick={() => setIsModalVisible(true)}
            className="bg-orange-600"
          >
            Edit Shop
          </Button>
        ) : (
          !isLoading && (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsModalVisible(true)}
              className="bg-orange-600"
            >
              Add Shop
            </Button>
          )
        )}
      </div>

      {shop ? (
        <Card>
          <div className="flex justify-end gap-2 mb-4">
            <Popconfirm
              title="Delete the shop"
              description="Are you sure you want to delete your shop? This will delete all associated items."
              onConfirm={handleDelete}
              okText="Yes, Delete"
              cancelText="No"
            >
              <Button type="primary" danger icon={<Trash2 size={16} />}>
                Delete Shop
              </Button>
            </Popconfirm>
          </div>

          <Image
            width={300}
            src={shop.image}
            alt={shop.name}
            className="rounded-lg shadow-md mb-4"
          />
          <Descriptions title={shop.name} bordered layout="vertical">
            <Descriptions.Item label="Owner">
              {shop.owner?.fullName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="City">{shop.city}</Descriptions.Item>
            <Descriptions.Item label="State">{shop.state}</Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>
              {shop.address}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        !isLoading && (
          <Empty description={<span>You haven't created a shop yet.</span>}>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsModalVisible(true)}
              className="bg-orange-600"
            >
              Add Your Shop Now
            </Button>
          </Empty>
        )
      )}

      <ShopFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={loading.createShop || loading.updateShop}
        initialData={shop} 
      />
    </Spin>
  );
};

export default OwnerMyShopPage;