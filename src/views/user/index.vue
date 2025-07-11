<template>
  <div class="user-container">
    <!-- 用户信息 -->
    <div class="user-header">
      <div class="user-info">
        <div class="avatar">
          <img :src="userInfo.avatar || defaultAvatar" alt="avatar">
        </div>
        <div class="info">
          <h3 class="name">{{ userInfo.nickname || '未登录' }}</h3>
          <p class="desc">{{ userInfo.desc || '这个人很懒，什么都没有留下' }}</p>
        </div>
      </div>
      <div class="settings">
        <van-icon name="setting-o" size="20" />
      </div>
    </div>
    
    <!-- 我的订单 -->
    <div class="user-card">
      <div class="card-header">
        <span>我的订单</span>
        <span class="more">全部订单 <van-icon name="arrow" /></span>
      </div>
      <van-grid :column-num="5" :border="false">
        <van-grid-item icon="pending-payment" text="待付款" />
        <van-grid-item icon="logistics" text="待发货" />
        <van-grid-item icon="paid" text="待收货" />
        <van-grid-item icon="comment-o" text="待评价" />
        <van-grid-item icon="after-sale" text="退款/售后" />
      </van-grid>
    </div>
    
    <!-- 我的服务 -->
    <div class="user-card">
      <div class="card-header">
        <span>我的服务</span>
      </div>
      <van-grid :column-num="4" :border="false">
        <van-grid-item icon="coupon-o" text="优惠券" />
        <van-grid-item icon="fire-o" text="积分商城" />
        <van-grid-item icon="medal-o" text="会员中心" />
        <van-grid-item icon="location-o" text="收货地址" />
        <van-grid-item icon="star-o" text="我的收藏" />
        <van-grid-item icon="browsing-history-o" text="浏览记录" />
        <van-grid-item icon="question-o" text="帮助中心" />
        <van-grid-item icon="service-o" text="联系客服" />
      </van-grid>
    </div>
    
    <!-- 退出登录 -->
    <div class="logout-btn">
      <van-button block round plain type="danger" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import defaultAvatar from '@/assets/default-avatar.png'

export default {
  name: 'User',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    // 用户信息
    const userInfo = computed(() => store.state.user.userInfo || {})
    
    // 获取用户信息
    const fetchUserInfo = async () => {
      try {
        await store.dispatch('user/getUserInfo')
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    }
    
    // 退出登录
    const onLogout = () => {
      Dialog.confirm({
        title: '提示',
        message: '确定要退出登录吗？',
      })
        .then(async () => {
          try {
            await store.dispatch('user/logout')
            Toast.success('退出成功')
            router.push('/login')
          } catch (error) {
            Toast.fail('退出失败')
          }
        })
        .catch(() => {
          // 取消操作
        })
    }
    
    onMounted(() => {
      fetchUserInfo()
    })
    
    return {
      userInfo,
      defaultAvatar,
      onLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  min-height: 100vh;
  background-color: $background-color-light;
  padding-bottom: 50px;
  
  .user-header {
    height: 200px;
    background-image: linear-gradient(to right, $primary-color, lighten($primary-color, 15%));
    padding: 20px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.5);
        overflow: hidden;
        margin-right: 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .info {
        .name {
          font-size: $font-size-large;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .desc {
          font-size: $font-size-small;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    
    .settings {
      padding: 10px;
    }
  }
  
  .user-card {
    background-color: #fff;
    border-radius: $border-radius-large;
    margin: 15px;
    padding: 15px 0;
    box-shadow: $box-shadow-light;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px 10px;
      font-size: $font-size-medium;
      font-weight: 500;
      
      .more {
        color: $text-color-secondary;
        font-size: $font-size-small;
        font-weight: normal;
      }
    }
  }
  
  .logout-btn {
    margin: 30px 15px;
  }
}
</style>
