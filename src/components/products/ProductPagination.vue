<script setup>
const pages = [1, 2, 3, 4, 5]
const activePage = 1
</script>

<template>
  <div
    class="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-white sm:flex-row sm:items-center sm:justify-between"
  >
    <p class="text-sm text-white/40">
      Showing curated results
    </p>

    <div class="flex items-center gap-2">
      <button
        class="grid h-10 w-10 place-items-center border border-white/10 bg-[#050607] text-white/45 transition hover:border-white/25 hover:text-white"
      >
        ‹
      </button>

      <button
        v-for="page in pages"
        :key="page"
        class="grid h-10 w-10 place-items-center border border-white/10 bg-[#050607] text-sm font-black transition hover:border-[#E50914] hover:text-white"
        :class="page === activePage ? 'border-[#E50914] bg-[#E50914] text-white' : 'text-white/45'"
      >
        {{ page }}
      </button>

      <button
        class="grid h-10 w-10 place-items-center border border-white/10 bg-[#050607] text-white/45 transition hover:border-white/25 hover:text-white"
      >
        ›
      </button>
    </div>
  </div>
</template>