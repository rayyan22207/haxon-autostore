<script setup>
const pages = [1, 2, 3, 4, 5]
const activePage = 1
</script>

<template>
  <div
    class="mt-12 flex flex-col gap-5 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
  >
    <p class="text-sm text-black/45">
      Showing curated results
    </p>

    <div class="flex items-center gap-2">
      <button
        class="grid h-11 w-11 place-items-center border border-black/10 bg-white text-black/45 transition hover:border-black/25 hover:text-black"
      >
        ‹
      </button>

      <button
        v-for="page in pages"
        :key="page"
        class="grid h-11 w-11 place-items-center border border-black/10 bg-white text-sm font-black transition"
        :class="
          page === activePage
            ? 'border-[#E50914] bg-[#E50914] text-white'
            : 'text-black/45 hover:border-[#E50914] hover:text-black'
        "
      >
        {{ page }}
      </button>

      <button
        class="grid h-11 w-11 place-items-center border border-black/10 bg-white text-black/45 transition hover:border-black/25 hover:text-black"
      >
        ›
      </button>
    </div>
  </div>
</template>