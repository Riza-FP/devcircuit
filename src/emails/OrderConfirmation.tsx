import * as React from 'react';
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import { formatCurrency } from '../lib/utils'; // Careful with imports in emails

// Define types locally to avoid complex imports if needed
interface OrderItem {
    id: string;
    product: {
        name: string;
        image_url: string | null;
    };
    quantity: number;
    unit_price: number;
}

interface OrderConfirmationProps {
    orderId: string;
    orderDate: string;
    items: OrderItem[];
    total: number;
    shippingDetails: {
        name: string;
        address: string;
        city: string;
        postal_code: string;
    };
}

export const OrderConfirmationEmail = ({
    orderId,
    orderDate,
    items,
    total,
    shippingDetails,
}: OrderConfirmationProps) => {
    const previewText = `Order Confirmation #${orderId.slice(0, 8)}`;

    // Simple currency formatter locally if utils fails in react-email build context
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Thank you for your order!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {shippingDetails.name},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Your order <strong>#{orderId.slice(0, 8)}</strong> has been confirmed and is being processed.
                        </Text>

                        <Section className="mt-[32px]">
                            <Row>
                                <Column className="align-top">
                                    <Text className="m-0 font-bold">Shipping Address</Text>
                                    <Text className="m-0 text-gray-500">
                                        {shippingDetails.name}<br />
                                        {shippingDetails.address}<br />
                                        {shippingDetails.city}, {shippingDetails.postal_code}
                                    </Text>
                                </Column>
                                <Column className="align-top pl-[20px]">
                                    <Text className="m-0 font-bold">Order Date</Text>
                                    <Text className="m-0 text-gray-500">
                                        {new Date(orderDate).toLocaleDateString()}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Section>
                            {items.map((item) => (
                                <Row key={item.id} className="mb-4">
                                    <Column>
                                        <Text className="m-0 font-bold">{item.product.name}</Text>
                                        <Text className="m-0 text-gray-500 text-sm">
                                            {item.quantity} x {formatPrice(item.unit_price)}
                                        </Text>
                                    </Column>
                                    <Column className="text-right align-top">
                                        <Text className="m-0 font-bold">
                                            {formatPrice(item.unit_price * item.quantity)}
                                        </Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Section>
                            <Row>
                                <Column>
                                    <Text className="m-0 font-bold text-[18px]">Total</Text>
                                </Column>
                                <Column className="text-right">
                                    <Text className="m-0 font-bold text-[18px]">
                                        {formatPrice(total)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-black text-[14px] leading-[24px]">
                            We'll notify you when your order ships.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderConfirmationEmail;
