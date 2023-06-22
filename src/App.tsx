import { Avatar, Button, List, Typography, Modal, Spin } from 'antd'
import { GithubFilled } from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const { Paragraph, Text } = Typography

const KEY_NAME = 'doraemon_user_name'
const KEY_AVATAR = 'doraemon_user_avatar'

export default () => {

  const [loginLoading, setLoginLoading] = useState<boolean>(false)

  const [userInfo, setUserInfo] = useState<{
    name?: string | null,
    avatar?: string | null
  }>({
    name: localStorage.getItem(KEY_NAME),
    avatar: localStorage.getItem(KEY_AVATAR),
  })

  useEffect(() => {
    const broadcast = new BroadcastChannel('Doraemon')

    broadcast.onmessage = e => {
      const data = e.data
      if (data.category === 'callback') {
        console.log('[BroadcastChannel] receive data:', data)

        setLoginLoading(false)

        const queries = new URLSearchParams(data.queriesString)
        const accessToken = queries.get('access_token')

        axios
          .get(
            'https://api.github.com/user',
            { headers: { Authorization: 'Bearer ' + accessToken } },
          )
          .then(res => {
            const { avatar_url, name } = res.data
            setUserInfo({
              name,
              avatar: avatar_url,
            })

            localStorage.setItem(KEY_NAME, name)
            localStorage.setItem(KEY_AVATAR, avatar_url)
          })
      }
    }
  }, [])

  const doLogin = () => {
    setLoginLoading(true)

    const loginUrl = 'https://github.com/login/oauth/authorize?client_id=59e7a16e191e4d506e53'
    window.open(loginUrl, 'Github登录', 'height=700,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no')
  }

  const doLogout = () => {
    localStorage.removeItem(KEY_NAME)
    localStorage.removeItem(KEY_AVATAR)

    window.location.replace(window.location.origin)
  }

  return <div>
    <Modal
      open={loginLoading}
      title="授权登录中，请稍后..."
      closable={false}
      destroyOnClose={true}
      cancelText={'取消'}
      okText={'关闭'}
      footer={[
        <Button type={'primary'} onClick={() => setLoginLoading(false)}>关闭</Button>,
      ]}
    >
      <div>登录完成会自动关闭，若有异常可重试。</div>
      <Spin spinning>
        <div style={{ height: 50 }} />
      </Spin>
    </Modal>

    <List>
      <List.Item
        actions={
          [
            userInfo.name ?
              <Button key="list-logout" danger onClick={doLogout}>登出</Button> :
              <Button key="list-login" type={'primary'} onClick={doLogin}>登录</Button>,
          ]
        }
      >
        <List.Item.Meta
          avatar={
            <Avatar
              size={50}
              icon={
                <GithubFilled onClick={doLogin} />
              }
              src={userInfo.avatar}
            />
          }
          title={userInfo.name ?? '未登录'}
          description={'获取github的账号名和头像，获取后会通过localStorage存储'} />
        <div>
          <ul>
            <Paragraph>名字（localStorage key）:<Text code>{KEY_NAME}</Text></Paragraph>
          </ul>
          <ul>
            <Paragraph>头像（localStorage key）:<Text code>{KEY_AVATAR}</Text></Paragraph>
          </ul>
        </div>
      </List.Item>
    </List>
  </div>
}
