'use client';

import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  TagsOutlined, 
  FolderOutlined,
  ImportOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: <Link href="/admin">仪表板</Link>,
  },
  {
    key: '/admin/articles',
    icon: <FileTextOutlined />,
    label: <Link href="/admin/articles">文章管理</Link>,
  },
  {
    key: '/admin/categories',
    icon: <FolderOutlined />,
    label: <Link href="/admin/categories">分类管理</Link>,
  },
  {
    key: '/admin/tags',
    icon: <TagsOutlined />,
    label: <Link href="/admin/tags">标签管理</Link>,
  },
  {
    key: 'interview-questions',
    icon: <QuestionCircleOutlined />,
    label: '面试题管理',
    children: [
      {
        key: '/admin/interview-questions',
        label: <Link href="/admin/interview-questions">题目管理</Link>,
      },
      {
        key: '/admin/interview-questions/categories',
        label: <Link href="/admin/interview-questions/categories">分类管理</Link>,
      },
      {
        key: '/admin/interview-questions/import',
        icon: <ImportOutlined />,
        label: <Link href="/admin/interview-questions/import">批量导入</Link>,
      },
    ],
  },
];

const getBreadcrumbItems = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const items = [
    {
      title: <Link href="/admin">管理后台</Link>,
    },
  ];

  if (pathSegments.length > 1) {
    const section = pathSegments[1];
    const sectionMap: Record<string, string> = {
      articles: '文章管理',
      categories: '分类管理',
      tags: '标签管理',
      import: '批量导入',
      'interview-questions': '面试题管理',
    };

    if (sectionMap[section]) {
      items.push({
        title: sectionMap[section],
      });
    }
  }

  return items;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          博客管理
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ padding: '0 24px' }}>
            <Breadcrumb 
              style={{ margin: '16px 0' }}
              items={getBreadcrumbItems(pathname)}
            />
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: '#fff',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
