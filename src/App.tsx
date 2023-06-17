import { Avatar, Button, List, Typography, Skeleton } from 'antd'
import {
  GithubFilled,
} from '@ant-design/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const { Title, Paragraph, Text, Link } = Typography

const KEY_TOKEN = 'doraemon_access_token'
const KEY_NAME = 'doraemon_user_name'
const KEY_AVATAR = 'doraemon_user_avatar'

export default () => {
  let accessToken = localStorage.getItem(KEY_TOKEN)

  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>()
  const [userName, setUserName] = React.useState<string | undefined>()

  useEffect(() => {
    // accessToken = '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'
    if (!accessToken) {
      return
    }

    axios.get('https://api.github.com/user',
      { headers: { Authorization: 'Bearer ' + accessToken } },
    ).then(res => {
      const { avatar_url, name } = res.data
      setAvatarUrl(avatar_url)

      localStorage.setItem(KEY_NAME, name)
      localStorage.setItem(KEY_AVATAR, avatar_url)

      setUserName(name)
    })
  }, [])

  const doLogin = () => {
    window.location.replace('https://github.com/login/oauth/authorize?client_id=59e7a16e191e4d506e53')
  }

  const doLogout = () => {
    localStorage.removeItem(KEY_TOKEN)
    localStorage.removeItem(KEY_NAME)
    localStorage.removeItem(KEY_AVATAR)

    window.location.replace(window.location.origin)
  }

  if (accessToken && !userName) {
    return <Skeleton avatar paragraph={{ rows: 4 }}></Skeleton>
  }

  return <div>
    <List>
      <List.Item
        actions={
          [
            accessToken ?
              <Button type={'dashed'} key="list-logout" onClick={doLogout}>登出</Button> :
              <Button type={'primary'} key="list-login" onClick={doLogin}>登录</Button>,
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
              src={avatarUrl}
            />
          }
          title={userName ?? '未登录'}
          description={'获取github的账号名和头像，获取后会通过localStorage存储'} />
        <div>
          <ul>
            <Paragraph>用户Token（localStorage key）：<Text code>{KEY_TOKEN}</Text></Paragraph>
          </ul>

          <ul>
            <Paragraph>名字（localStorage key）：<Text code>{KEY_NAME}</Text></Paragraph>
          </ul>

          <ul>
            <Paragraph>头像（localStorage key）：<Text code>{KEY_AVATAR}</Text></Paragraph>
          </ul>
        </div>
      </List.Item>
    </List>
  </div>
}
