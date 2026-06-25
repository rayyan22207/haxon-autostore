<template>
  <section class="bg-black py-8 text-white">
    <div class="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
      <div class="grid border border-white/10 bg-[#050607] md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in trustItems"
          :key="item.title"
          class="group flex items-center gap-5 border-b border-white/10 px-7 py-6 last:border-b-0 md:border-r md:last:border-r-0 lg:border-b-0"
        >
          <div class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/25 text-xl text-white/60 transition group-hover:border-[#E50914]/70 group-hover:text-white">
            {{ item.icon }}
          </div>

          <div>
            <p class="text-[12px] font-black uppercase tracking-[0.16em] text-white/80">
              {{ item.title }}
            </p>
            <p class="mt-2 text-sm font-medium text-white/45">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const trustItems = [
  {
    icon: '✓',
    title: '100% Authentic',
    text: 'Genuine products only.',
  },
  {
    icon: '▣',
    title: 'Fast & Secure Shipping',
    text: 'Nationwide delivery.',
  },
  {
    icon: '↺',
    title: 'Easy Returns',
    text: 'Hassle free returns.',
  },
  {
    icon: '♢',
    title: 'Expert Support',
    text: 'We’re here to help.',
  },
]
</script>