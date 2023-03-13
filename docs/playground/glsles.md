---
title: 学习 GLSL ES 着色器语言
group:
  title: 前置知识
  order: 0
---

## 什么是 GLSL ES

GLSL ES 是 OpenGL ES 的着色语言，它是 OpenGL ES 2.0 和 OpenGL ES 3.0 的一部分。它是一种类 C 语言，用于在 GPU 上编写着色器程序。

## 类型

### 基本类型

float、init、bool

#### 赋值与类型转换

```glsl
float a = 1.0;
int b = 1;
bool c = true;
float d = float(b);
int e = int(a);
```

### 数据类型

- vec2、vec3、vec4： 2、3、4 个浮点数的向量
- ivec2、ivec3、ivec4： 2、3、4 个整数的向量
- bvec2、bvec3、bvec4： 2、3、4 个布尔值的向量
- mat2、mat3、mat4： 用于表示二维、三维、四维矩阵，
- sampler2D、samplerCube： 用于表示纹理。

#### 赋值与类型转换

```glsl
vec2 a = vec2(1.0, 1.0); // 或者 vec2 a = vec2(1.0);
vec3 b = vec3(1.0, 1.0, 1.0);
vec4 c = vec4(1.0, 1.0, 1.0, 1.0);
ivec2 d = ivec2(1, 1);
ivec3 e = ivec3(1, 1, 1);
ivec4 f = ivec4(1, 1, 1, 1);
bvec2 g = bvec2(true, false);
bvec3 h = bvec3(true, false, true);
bvec4 i = bvec4(true, false, true, false);
mat2 j = mat2(1.0, 0.0, 0.0, 1.0);
mat3 k = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
sampler2D m = sampler2D(1);
samplerCube n = samplerCube(1);
```

### 结构体

```glsl
struct Person {
  vec3 position;
  vec3 color;
  float size;
};
```

#### 赋值

```glsl
Person p;
p.position = vec3(1.0, 1.0, 1.0);
p.color = vec3(1.0, 1.0, 1.0);
p.size = 1.0;
```

### 数组

```glsl
float a[3]; // 定义一个长度为 3 的数组
vec3 b[3]; // 定义一个长度为 3 的数组，数组中的每个元素都是一个 vec3 类型
```

## 全局变量与局部变量

### 常量

```glsl
const float PI = 3.1415926;
```

### Attribute 变量

attribute 变量只能用于顶点着色器中，并且它是只读的，不能被赋值。

```glsl
attribute vec4 a_Position;
```

### Uniform 变量

uniform 变量是全局变量，它可以在顶点着色器与片元着色器中使用，但是它的值只能在 JavaScript 中设置，不能在着色器中设置。

```glsl
uniform vec4 u_FragColor;
```

### Varying 变量

varying 变量是全局变量，它可以在顶点着色器与片元着色器中使用，但是它的值只能在顶点着色器中设置，不能在片元着色器中设置。

```glsl
varying vec4 v_Color;
```

## 精度修饰符

- highp：高精度,顶点着色器中默认精度
- mediump：中等精度，片元着色器中默认精度
- lowp：低精度，可以表示所有颜色

```glsl
precision mediump float;
```

### 默认精度

｜着色器类型｜数据类型｜默认精度｜
｜-｜-｜-｜
｜顶点着色器｜ float ｜ highp ｜
｜顶点着色器｜ int ｜ highp ｜
｜顶点着色器｜ bool ｜ highp ｜
｜片元着色器｜ init ｜ mediump ｜
｜片元着色器｜ float ｜无｜
｜片元着色器｜ sampler2D ｜ lowp ｜
｜片元着色器｜ samplerCube ｜ lowp ｜

片元着色器中的 float 类型没有默认精度，因此必须指定精度。如果不指定精度，编译器会报错。
