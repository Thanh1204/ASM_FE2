import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton, Table, Image, Button, message, Popconfirm } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductsAdminPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:3000/products`);
            return response.data.map((product) => ({
                key: product.id,
                ...product,
            }));
        },
    });
    const { mutate } = useMutation({
        mutationFn: async (id) => {
            await axios.delete(`http://localhost:3000/products/${id}`);
        },
        onSuccess: () => {
            messageApi.success("Xóa sản phẩm thành công");
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
    });
    const columns = [
      
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Danh mục",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (value) => {
                return <strong>{value}</strong>;
            },
        },
        {
            title: "Tình trạng",
            dataIndex: "available",
            key: "available",
            render: (available) => <div>{available ? "Còn hàng" : "Hết hàng"}</div>,
        },
        {
            title: "Loại hàng",
            dataIndex: "type",
            key: "type",
            render: (type) => <div>{type === "type1" ? "Hàng cũ" : "Hàng mới"}</div>,
        },
        {
            key: "action",
            render: (_, item) => (
                <div className="w-20 flex space-x-4">
                    <Link to={`/admin/products/add`}>
                        <Button>Thêm</Button>
                    </Link>
                    <Link to={`/admin/products/${item.id}/edit`}>
                        <Button type="primary">Sửa</Button>
                    </Link>
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn xóa item này không?"
                        onConfirm={() => mutate(item.id)}
                        okText="Đồng ý"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    return (
        <div>
            {contextHolder}
            <h1 className="text-3xl mb-5">Quản lý sản phẩm</h1>
            <Skeleton loading={isLoading} active>
                <Table dataSource={data} columns={columns} />
            </Skeleton>
        </div>
    );
};
export default ProductsAdminPage;

