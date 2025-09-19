import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { registerUser } from '@/utils/api'
import { validateEmail, validatePassword } from '@/utils/validation'

interface SignupFormProps {
  onSuccess: () => void
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0] // Show first error
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      })
      
      if (response.success) {
        // Store login state in localStorage
        localStorage.setItem('isLoggedin', 'true')
        localStorage.setItem('user', JSON.stringify({
          id: response.user?.id || 'user123',
          Name1: response.user?.full_name || formData.full_name,
          email: response.user?.email || formData.email,
          token: response.token
        }))
        
        toast.success('Account created successfully!')
        onSuccess()
      } else {
        toast.error(response.message || 'Signup failed. Please try again.')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 min-w-72">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Enter your full name"
          value={formData.full_name}
          onChange={handleChange}
          className={errors.full_name ? 'border-red-500' : ''}
          required
        />
        {errors.full_name && (
          <p className="text-sm text-red-500">{errors.full_name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-500' : ''}
          required
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
        <p className="text-xs text-gray-500">
          {/* Password must contain: uppercase letter, lowercase letter, special character, and be longer than 6 characters */}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          required
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#E3450A] hover:bg-[#E3450A]/90"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  )
}
