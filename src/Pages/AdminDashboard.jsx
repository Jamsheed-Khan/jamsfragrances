import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Table,
  Avatar,
  Select,
  Input,
  Row,
  Col,
  notification,
  Button,
  Modal,
  Form,
  Input as AntInput,
  Popconfirm,
} from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  SearchOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "chart.js/auto";

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ sales: 0, pending: 0, totalOrders: 0 });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      notification.error({
        message: "Error fetching products",
        description: error.message,
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalSales = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = ordersData.filter((order) => order.status === "Pending").length;

      setOrders(ordersData);
      setStats({ sales: totalSales, pending: pendingOrders, totalOrders: ordersData.length });
    } catch (error) {
      notification.error({
        message: "Error fetching orders",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      notification.success({ message: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      notification.error({ message: "Error deleting product", description: error.message });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const handleSaveProduct = async (values) => {
    try {
      await updateDoc(doc(db, "products", editingProduct.id), values);
      notification.success({ message: "Product updated successfully" });
      setEditModalVisible(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      notification.error({ message: "Error updating product", description: error.message });
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic title="Total Sales" value={stats.sales} prefix="$" />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic title="Pending Orders" value={stats.pending} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic title="Total Orders" value={stats.totalOrders} />
              </Card>
            </Col>
            <Col xs={24}>
              <Card>
                <Bar
                  data={{
                    labels: ["Total Sales", "Pending Orders", "Total Orders"],
                    datasets: [
                      {
                        label: "Stats",
                        data: [stats.sales, stats.pending, stats.totalOrders],
                        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
                      },
                    ],
                  }}
                  options={{ responsive: true }}
                />
              </Card>
            </Col>
          </Row>
        );
      case "products":
        return (
          <Table
            dataSource={products}
            rowKey="id"
            columns={[
              { title: "Name", dataIndex: "name" },
              {
                title: "Image",
                dataIndex: "imageUrl",
                render: (url) => <img src={url} alt="Product" style={{ width: 50 }} />,
              },
              { title: "Description", dataIndex: "description" },
              { title: "Price", dataIndex: "price" },
              { title: "Discount", dataIndex: "discount" },
              { title: "Category", dataIndex: "category" },
              { title: "Details", dataIndex: "details" },
              {
                title: "Actions",
                render: (_, record) => (
                  <>
                    <Button onClick={() => handleEditProduct(record)}>Edit</Button>
                    <Popconfirm
                      title="Are you sure to delete this product?"
                      onConfirm={() => handleDeleteProduct(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </>
                ),
              },
            ]}
          />
        );
      case "orders":
        return (
          <Table
            dataSource={orders}
            rowKey="id"
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Email", dataIndex: "email" },
              { title: "Phone", dataIndex: "phone" },
              { title: "Address", dataIndex: "address" },
              { title: "Postal Code", dataIndex: "postalCode" },
              { title: "Payment Method", dataIndex: "paymentMethod" },
              { title: "Payment Details", dataIndex: "paymentDetails" },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: "#fff" }}>
        <div className="logo" style={{ padding: "16px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
          EcomMaster
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          onClick={(e) => setSelectedMenu(e.key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="products" icon={<ShopOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            Orders
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px" }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Select defaultValue="Electronics" style={{ width: 200 }} />
            </Col>
            <Col>
              <Input placeholder="Search" prefix={<SearchOutlined />} style={{ marginRight: 16, width: 300 }} />
              <BellOutlined style={{ fontSize: 20, marginRight: 24 }} />
              <Avatar icon={<UserOutlined />} />
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: "16px", padding: 24, background: "#f0f2f5" }}>{renderContent()}</Content>
      </Layout>
      <Modal
        title="Edit Product"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        {editingProduct && (
          <Form layout="vertical" initialValues={editingProduct} onFinish={handleSaveProduct}>
            <Form.Item label="Name" name="name">
              <AntInput />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <AntInput />
            </Form.Item>
            <Form.Item label="Price" name="price">
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="Discount" name="discount">
              <AntInput type="number" />
            </Form.Item>
            <Form.Item label="Category" name="category">
              <AntInput />
            </Form.Item>
            <Form.Item label="Details" name="details">
              <AntInput.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form>
        )}
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;
