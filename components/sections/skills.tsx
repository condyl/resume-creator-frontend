'use client'

import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormattedInput } from "@/components/ui/formatted-input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const skillSuggestions = {
  languages: [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin",
    "PHP", "Rust", "Scala", "R", "MATLAB", "SQL", "HTML", "CSS", "Shell", "Perl"
  ],
  frameworks: [
    "React", "Angular", "Vue.js", "Next.js", "Django", "Flask", "Spring", "Express.js", "Laravel",
    "Ruby on Rails", "ASP.NET", "FastAPI", "TensorFlow", "PyTorch", "Node.js", "Svelte",
    "Bootstrap", "Tailwind CSS", "Material-UI", "jQuery"
  ],
  tools: [
    "Git", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Jenkins", "CircleCI",
    "GitHub Actions", "Jira", "Confluence", "VS Code", "IntelliJ IDEA", "PyCharm", "Postman",
    "Webpack", "npm", "yarn", "Linux", "Nginx"
  ]
}

interface SkillsProps {
  skills: {
    languages: string
    frameworks: string
    tools: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number | null, section: string, field: string) => void
}

interface SkillCategory {
  name: string
  field: keyof typeof skillSuggestions
  placeholder: string
}

type SkillField = keyof typeof skillSuggestions

const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    field: "languages",
    placeholder: "Add a programming language..."
  },
  {
    name: "Frameworks & Libraries",
    field: "frameworks",
    placeholder: "Add a framework..."
  },
  {
    name: "Tools & Technologies",
    field: "tools",
    placeholder: "Add a tool..."
  }
]

export default function Skills({ skills, handleChange }: SkillsProps) {
  const [open, setOpen] = React.useState<{ [K in SkillField]?: boolean }>({})
  const [search, setSearch] = React.useState<{ [K in SkillField]?: string }>({})

  const getSkillsArray = (field: SkillField) => {
    return skills[field].split(',').map(s => s.trim()).filter(Boolean)
  }

  const handleAddSkill = (field: SkillField, skill: string) => {
    const currentSkills = getSkillsArray(field)
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ')
      handleChange(
        { target: { value: newSkills } } as React.ChangeEvent<HTMLInputElement>,
        null,
        'skills',
        field
      )
    }
    setOpen({ ...open, [field]: false })
    setSearch({ ...search, [field]: '' })
  }

  const handleRemoveSkill = (field: SkillField, skillToRemove: string) => {
    const currentSkills = getSkillsArray(field)
    const newSkills = currentSkills.filter(skill => skill !== skillToRemove).join(', ')
    handleChange(
      { target: { value: newSkills } } as React.ChangeEvent<HTMLInputElement>,
      null,
      'skills',
      field
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-6">
          {skillCategories.map((category) => (
            <div key={category.field} className="space-y-2">
              <Label htmlFor={category.field}>{category.name}</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {getSkillsArray(category.field).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => handleRemoveSkill(category.field, skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-1 [@media(min-width:1024px)_and_(min-width:600px)]:grid-cols-[280px_1fr] gap-2">
                <Popover open={open[category.field]} onOpenChange={(isOpen) => setOpen({ ...open, [category.field]: isOpen })}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open[category.field]}
                      className="w-full justify-between whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {category.name}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${category.name.toLowerCase()}...`}
                        value={search[category.field]}
                        onValueChange={(value) => setSearch({ ...search, [category.field]: value })}
                      />
                      <CommandEmpty>No {category.name.toLowerCase()} found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {skillSuggestions[category.field].map((skill) => (
                          <CommandItem
                            key={skill}
                            value={skill}
                            onSelect={() => handleAddSkill(category.field, skill)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                getSkillsArray(category.field).includes(skill) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {skill}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  value={search[category.field] || ''}
                  onChange={(e) => setSearch({ ...search, [category.field]: e.target.value })}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const input = e.currentTarget
                      if (input.value.trim()) {
                        handleAddSkill(category.field, input.value.trim())
                        setSearch({ ...search, [category.field]: '' })
                      }
                    }
                  }}
                  placeholder={category.placeholder}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}