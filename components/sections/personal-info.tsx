'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, User, Mail, Phone, Globe, Github, Linkedin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface PersonalInfoProps {
  personalInfo: {
    name: string
    email: string
    github: string
    website: string
    linkedin: string
    phone: string
  }
  showIcons: {
    email: boolean
    github: boolean
    linkedin: boolean
    phone: boolean
    website: boolean
  }
  toggleIcon: (field: 'email' | 'github' | 'linkedin' | 'phone' | 'website') => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void
}

export default function PersonalInfo({ personalInfo, showIcons, toggleIcon, handleChange }: PersonalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">
            Name <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Full Name"
                value={personalInfo.name}
                onChange={(e) => handleChange(e, null, 'personalInfo', 'name')}
                className="pl-9"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={personalInfo.email}
                onChange={(e) => handleChange(e, null, 'personalInfo', 'email')}
                className={cn("pl-9", !showIcons.email && "text-muted-foreground")}
                required
              />
            </div>
            <Button onClick={() => toggleIcon('email')} size="icon" variant="outline" className="shrink-0">
              {showIcons.email ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Social Links & Contact</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  placeholder="GitHub Profile"
                  value={personalInfo.github}
                  onChange={(e) => handleChange(e, null, 'personalInfo', 'github')}
                  className={cn("pl-9", !showIcons.github && "text-muted-foreground")}
                />
              </div>
              <Button onClick={() => toggleIcon('github')} size="icon" variant="outline" className="shrink-0">
                {showIcons.github ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  placeholder="LinkedIn Profile"
                  value={personalInfo.linkedin}
                  onChange={(e) => handleChange(e, null, 'personalInfo', 'linkedin')}
                  className={cn("pl-9", !showIcons.linkedin && "text-muted-foreground")}
                />
              </div>
              <Button onClick={() => toggleIcon('linkedin')} size="icon" variant="outline" className="shrink-0">
                {showIcons.linkedin ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  placeholder="Personal Website"
                  value={personalInfo.website}
                  onChange={(e) => handleChange(e, null, 'personalInfo', 'website')}
                  className={cn("pl-9", !showIcons.website && "text-muted-foreground")}
                />
              </div>
              <Button onClick={() => toggleIcon('website')} size="icon" variant="outline" className="shrink-0">
                {showIcons.website ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  value={personalInfo.phone}
                  onChange={(e) => handleChange(e, null, 'personalInfo', 'phone')}
                  className={cn("pl-9", !showIcons.phone && "text-muted-foreground")}
                />
              </div>
              <Button onClick={() => toggleIcon('phone')} size="icon" variant="outline" className="shrink-0">
                {showIcons.phone ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}