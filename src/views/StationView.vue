<script setup lang="ts"></script>

<template>
  <div>
    <h2>Station View</h2>
    <div>Line : {{ $route.params.lineid }}</div>
    <div>Station : {{ $route.params.id }}</div>
  </div>
</template>
