import mongoose from 'mongoose'

// 精灵 Schema
const spriteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  form: { 
    type: String, 
    enum: ['seedling', 'bloom', 'tree', 'crystal', 'dragon'],
    default: 'seedling'
  },
  element: {
    type: String,
    enum: ['light', 'forest', 'star', 'wind', 'water'],
    default: 'light'
  },
  color: { type: String, default: 'from-yellow-300 to-yellow-500' },
  intimacyLevel: { type: Number, default: 1 },
  intimacyExp: { type: Number, default: 0 },
  starlight: { type: Number, default: 100 },
  unlockedAnimations: { type: [String], default: ['idle', 'happy'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// 学生 Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classId: { type: String, required: true },
  avatar: String,
  sprite: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprite' },
  totalStarlight: { type: Number, default: 0 },
  achievements: [{ type: String }],
  birthday: Date,
  createdAt: { type: Date, default: Date.now },
})

// 任务 Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  story: String,
  type: {
    type: String,
    enum: ['daily', 'weekly', 'special'],
    default: 'daily',
  },
  classId: { type: String, required: true },
  starlightReward: { type: Number, default: 10 },
  intimacyReward: { type: Number, default: 5 },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  completedBy: [{
    studentId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

// 赞赏 Schema
const praiseSchema = new mongoose.Schema({
  fromStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fromStudentName: { type: String, required: true },
  toStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  message: { type: String, required: true, maxlength: 200 },
  starlight: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
})

// 班级 Schema
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalStarlight: { type: Number, default: 0 },
  unlockedAreas: { type: [String], default: ['misty-valley'] },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  createdAt: { type: Date, default: Date.now },
})

// 教师 Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  createdAt: { type: Date, default: Date.now },
})

export const Sprite = mongoose.model('Sprite', spriteSchema)
export const Student = mongoose.model('Student', studentSchema)
export const Task = mongoose.model('Task', taskSchema)
export const Praise = mongoose.model('Praise', praiseSchema)
export const Class = mongoose.model('Class', classSchema)
export const Teacher = mongoose.model('Teacher', teacherSchema)
