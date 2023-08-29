import {
  AreaChart,
  BarChart,
  Bold,
  Card,
  Color,
  Flex,
  Grid,
  LineChart,
  Subtitle,
  Text,
  Title,
} from "@tremor/react";

import { bestSellingOrders, calculateAverageOrderValue, getPopularItems, getTotalSales, getUserSales } from "../../lib/mongodb/orders";
import { countOrders, countProducts, countUsers } from "../../lib/mongodb/document-count";

export default async function Home() {
  const aov = await calculateAverageOrderValue()
  const userCount = await countUsers()
  const productCount = await countProducts()
  const orderCount = await countOrders()

  const userSales = await getUserSales()
  const userSalesChart = {
    className: 'mt-6',
    data: userSales!.map((user) => ({
      name: user._id.toString(),
      "Total Revenue": user.totalRevenue
    })),
    index: 'name',
    categories: ['Total Revenue'],
    yAxisWidth: 48
  }

  const bestSelling = await bestSellingOrders()
  const bestSellingChart = {
    className: 'mt-6',
    data: bestSelling!.map((order) => ({
      name: order._id,
      "Items": order.totalQuantity
    })),
    categories: ['Items'],
    index: 'name'
  }

  const popularItems = await getPopularItems()
  const popularItemsChart = {
    className: 'mt-6',
    data: popularItems!.map((order) => ({
      name: order._id,
      "Items": order.itemCount
    })),
    categories: ['Items'],
    index: 'name'
  }

  const totalSales = await getTotalSales()
  const totalSalesChart = {
    className: 'mt-6',
    data: totalSales!.map((order) => ({
      name: order._id,
      'Monthly Sales Figure': order.totalSales
    })),
    index: 'name',
    categories: ['Monthly Sales Figure'],
    colors: ['blue'] as Color[],
    yAxisWidth: 48
  }
  
  return (
    <main className="p-12">
      <Title>Dashboard</Title>
      <Text>There are <Bold>{userCount}</Bold> users, <Bold>{productCount}</Bold> products and <Bold>{orderCount}</Bold> orders.</Text>
        <Grid numItemsLg={3} className="mt-6 gap-6">
          {/* User Sales */}
          <Card>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>User Sales</Text>
              </div>
            </Flex>
            <div className="mt-8 hidden sm:block">
              <BarChart {...userSalesChart} />
            </div>
          </Card>
          {/* Best Selling Products */}
          <Card>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>Best Selling Products</Text>
              </div>
            </Flex>
            <div className='mt-8 hidden sm:block'>
              <BarChart {...bestSellingChart} />
            </div>
          </Card>
          {/*Most Popular Products */}
          <Card>
            <Flex alignItems="start">
              <div className="truncate">
                <Text>Most Popular Products</Text>
              </div>
            </Flex>
            <div className="mt-8 hidden sm:block">
              <BarChart {...popularItemsChart} />
            </div>
          </Card>
        </Grid>
        {/* Total Sales */}
        <div className="mt-6">
          <Card>
            <>
            <div className="md:flex justify-between">
              <div>
                <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
                  <Title>Performance History</Title>
                </Flex>
                <Subtitle>Total Sales Overtime</Subtitle>
                <Text>The average order value is {aov}</Text>
              </div>
            </div>
            {/* web */}
            <div className="mt-8 hidden sm:block">
              <LineChart {...totalSalesChart} />
            </div>
            {/* mobile */}
            <div className="mt-8 sm:hidden">
              <LineChart
                {...totalSalesChart}
                startEndOnly={true}
                showGradient={true}
                showYAxis={false}
              />
            </div>
            </>
          </Card>
        </div>
      </main>
  )
}
