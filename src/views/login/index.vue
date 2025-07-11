<template>
  <div class="login-container">
    <div class="login-header">
    <!--
      <img src="@/assets/logo.png" class="logo" alt="logo">-->
      <h2 class="title">移动端应用</h2>
    </div>
    
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
            clearable
          />
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            clearable
          />
        </van-cell-group>
        
        <div class="form-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
        </div>
      </van-form>
      
      <div class="other-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        
        <div class="icon-list">
          <van-icon name="wechat" size="28" color="#07c160" />
          <van-icon name="weibo" size="28" color="#ee0a24" />
          <van-icon name="qq" size="28" color="#1989fa" />
        </div>
      </div>
    </div>
    
    <div class="login-footer">
      <p>登录即代表您已同意<a href="javascript:;">《用户协议》</a>和<a href="javascript:;">《隐私政策》</a></p>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const store = useStore()
    const loading = ref(false)
    
    const form = reactive({
      username: '',
      password: ''
    })
    
    const onSubmit = async (values) => {
      loading.value = true
      try {
        await store.dispatch('user/login', values)
        Toast.success('登录成功')
        router.push('/')
      } catch (error) {
        Toast.fail('登录失败：' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background-color: #fff;
  
  .login-header {
    padding-top: 60px;
    text-align: center;
    margin-bottom: 40px;
    
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 15px;
    }
    
    .title {
      font-size: 24px;
      color: $text-color-primary;
      font-weight: 500;
    }
  }
  
  .login-form {
    flex: 1;
    
    .form-actions {
      margin: 25px 16px 40px;
    }
    
    .other-login {
      padding: 0 16px;
      
      .divider {
        display: flex;
        align-items: center;
        color: $text-color-secondary;
        font-size: $font-size-small;
        margin-bottom: 20px;
        
        &::before,
        &::after {
          content: '';
          height: 1px;
          flex: 1;
          background-color: $border-color-base;
        }
        
        span {
          padding: 0 12px;
        }
      }
      
      .icon-list {
        @include flex(center, center);
        
        .van-icon {
          margin: 0 20px;
        }
      }
    }
  }
  
  .login-footer {
    padding: 20px 0;
    text-align: center;
    font-size: $font-size-small;
    color: $text-color-secondary;
    
    a {
      color: $primary-color;
    }
  }
}
</style>
