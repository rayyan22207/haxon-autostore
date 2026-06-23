<script setup>
const brands = [ 
  { name: 'Toyota', logo: 'src/assets/toyota.png' },
  { name: 'Honda', logo: '/brands/honda.svg' },
  { name: 'Suzuki', logo: '/brands/suzuki.svg' },
  { name: 'Kia', logo: '/brands/kia.svg' },
  { name: 'Hyundai', logo: '/brands/hyundai.svg' },
  { name: 'MG', logo: '/brands/mg.svg' },
  { name: 'Changan', logo: '/brands/changan.svg' },
]
</script>

<template>
  <section class="relative overflow-hidden border-y border-black/10 bg-[#f5f3ef] py-10 text-[#111]">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-sm">
          <div class="mb-3 flex items-center gap-4">
            <span class="h-px w-10 bg-[#d90429]"></span>

            <p class="text-[10px] font-black uppercase tracking-[0.34em] text-black/40">
              Brands
            </p>
          </div>

          <h2 class="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
            Popular in Pakistan.
          </h2>
        </div>

        <div class="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          <router-link
            v-for="brand in brands"
            :key="brand.name"
            :to="`/products?brand=${encodeURIComponent(brand.name)}`"
            class="group flex min-h-[92px] flex-col items-center justify-center border border-black/10 bg-white/60 px-4 py-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#d90429]/50 hover:bg-white hover:shadow-xl hover:shadow-black/5"
          >
            <div class="flex h-10 items-center justify-center">
              <img
                :src="brand.logo"
                :alt="`${brand.name} logo`"
                class="max-h-9 max-w-[72px] object-contain opacity-55 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                @error="$event.target.style.display = 'none'"
              />
            </div>

            <p class="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/45 transition group-hover:text-[#d90429]">
              {{ brand.name }}
            </p>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>