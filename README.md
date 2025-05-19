# Handling Errors with Vue.js and Laravel

A comprehensive guide to implementing robust error handling between Vue.js frontend and Laravel backend applications.



<p align="center"><br><br>
<img src="https://miro.medium.com/v2/resize:fit:700/1*j5FJ7bd3WxkNn0hu0Obd3Q.png" alt="Login Page" /><br><br>
</p>

more information at -
https://medium.com/@murilolivorato/handling-errors-with-vue-and-laravel-ea652603a495

## Overview

This project demonstrates how to implement effective error handling in a Vue.js + Laravel application, including:
- API error handling
- Form validation errors
- Global error management
- User-friendly error messages
- Error logging and monitoring

## Features

- Centralized error handling
- Form validation error management
- API error interceptors
- Global error state management
- User-friendly error messages
- Error logging
- Toast notifications for errors
- Error boundary implementation

## Prerequisites

### Backend Requirements
- PHP 8.1 or higher
- Composer
- Laravel 10.x
- MySQL or another database system

### Frontend Requirements
- Node.js (v14 or higher)
- Vue.js 3.x
- npm or yarn
- Axios for API requests

## Installation

### Backend Setup

1. Clone the Laravel repository:
```bash
git clone <laravel-repository-url>
cd laravel-error-handling
```

2. Install dependencies:
```bash
composer install
```

3. Configure your environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

### Frontend Setup

1. Create a new Vue.js application:
```bash
npm init vue@latest
cd vue-error-handling
```

2. Install required dependencies:
```bash
# API and State Management
npm install axios pinia

# UI Components
npm install vue-toastification
npm install @quasar/extras
npm install quasar

# Form Handling
npm install vee-validate yup
```

## Project Structure

### Backend Structure

app/
├── Exceptions/
│ └── Handler.php
├── Http/
│ ├── Controllers/
│ │ └── Api/
│ │ └── AuthUserController.php
│ ├── Requests/
│ │ └── RegisterUserRequest.php
│ └── Middleware/
│ └── ApiErrorHandler.php
└── Services/
└── ErrorService.php

### Frontend Structure

src/
├── components/
│ ├── ErrorBoundary/
│ │ └── ErrorBoundary.vue
│ └── common/
│ └── ErrorMessage.vue
├── services/
│ ├── api.js
│ └── errorHandler.js
├── stores/
│ └── errorStore.js
└── utils/
└── errorUtils.js

## Implementation

### Backend Error Handling

1. **Custom Request Validation**
```php
// app/Http/Requests/RegisterUserRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|min:3|max:32',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|max:8',
            'password_confirmation' => 'required|string|same:password',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The name field is required.',
            'email.unique' => 'This email is already registered.',
            'password.min' => 'Password must be at least 6 characters.',
        ];
    }
}
```

2. **API Controller**
```php
// app/Http/Controllers/Api/AuthUserController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;

class AuthUserController extends Controller
{
    public function register(RegisterUserRequest $request)
    {
        try {
            // Registration logic here
            return response()->json([
                'message' => 'Registration successful'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

### Frontend Error Handling

1. **API Service with Error Interceptor**
```javascript
// src/services/api.js
import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (response) {
      // Handle validation errors
      if (response.status === 422) {
        const errors = response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(errors[key][0]);
        });
      }
      
      // Handle other errors
      else {
        toast.error(response.data.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

2. **Error Store with Pinia**
```javascript
// src/stores/errorStore.js
import { defineStore } from 'pinia';

export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [],
    hasError: false
  }),
  
  actions: {
    setError(error) {
      this.errors.push(error);
      this.hasError = true;
    },
    
    clearErrors() {
      this.errors = [];
      this.hasError = false;
    }
  }
});
```

3. **Form Component with Error Handling**
```vue
<!-- src/components/RegisterForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        v-model="form.name"
        type="text"
        id="name"
        :class="{ 'is-invalid': errors.name }"
      />
      <div v-if="errors.name" class="error-message">
        {{ errors.name[0] }}
      </div>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        v-model="form.email"
        type="email"
        id="email"
        :class="{ 'is-invalid': errors.email }"
      />
      <div v-if="errors.email" class="error-message">
        {{ errors.email[0] }}
      </div>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
        v-model="form.password"
        type="password"
        id="password"
        :class="{ 'is-invalid': errors.password }"
      />
      <div v-if="errors.password" class="error-message">
        {{ errors.password[0] }}
      </div>
    </div>

    <button type="submit" :disabled="isSubmitting">
      Register
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useErrorStore } from '@/stores/errorStore';
import { useToast } from 'vue-toastification';
import api from '@/services/api';

const errorStore = useErrorStore();
const toast = useToast();

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const errors = ref({});
const isSubmitting = ref(false);

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    errors.value = {};
    
    const response = await api.post('/register', form);
    toast.success('Registration successful!');
    
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    errorStore.setError(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
```

## Error Types and Handling

1. **API Errors**
   - Network errors
   - Validation errors
   - Authentication errors
   - Server errors

2. **Form Validation Errors**
   - Client-side validation
   - Server-side validation
   - Field-level errors
   - Form-level errors

3. **Runtime Errors**
   - Component errors
   - State management errors
   - Unexpected errors

## Best Practices

1. **Error Handling**
   - Use consistent error formats
   - Implement proper error logging
   - Provide user-friendly messages
   - Handle all possible error cases

2. **Code Organization**
   - Centralize error handling logic
   - Use error boundaries effectively
   - Implement proper error recovery
   - Maintain clean error messages

3. **User Experience**
   - Show clear error messages
   - Provide recovery options
   - Maintain application state
   - Handle errors gracefully

## Testing

1. **Error Handling Tests**
```javascript
// tests/errorHandler.spec.js
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import RegisterForm from '@/components/RegisterForm.vue';

describe('RegisterForm', () => {
  it('should display validation errors', async () => {
    const wrapper = mount(RegisterForm);
    
    await wrapper.find('form').trigger('submit');
    
    expect(wrapper.find('.error-message').exists()).toBe(true);
  });
});
```

## 👥 Author

For questions, suggestions, or collaboration:
- **Author**: Murilo Livorato
- **GitHub**: [murilolivorato](https://github.com/murilolivorato)
- **linkedIn**: https://www.linkedin.com/in/murilo-livorato-80985a4a/



## 📸 Screenshots

### Login Page
![Login Page](https://miro.medium.com/v2/resize:fit:700/1*BlgYOMkXO6tFgd02JTlTkw.png)

### Dashboard
![Dashboard](https://miro.medium.com/v2/resize:fit:700/1*DYtWlbCEhRlTan-y6oc-jg.png)

### Edit Profile
![Edit Profile](https://miro.medium.com/v2/resize:fit:700/1*aoBrZgWF_fGeLyAJA1bpYA.png)

<div align="center">
  <h3>⭐ Star This Repository ⭐</h3>
  <p>Your support helps us improve and maintain this project!</p>
  <a href="https://github.com/murilolivorato/handling_errors_vue/stargazers">
    <img src="https://img.shields.io/github/stars/murilolivorato/handling_errors_vue?style=social" alt="GitHub Stars">
  </a>
</div>
