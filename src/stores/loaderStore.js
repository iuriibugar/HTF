import { ref, computed } from 'vue'

// Reference-counted global loader store with image-waiting support
const counter = ref(0)
const waitingForImages = ref(false)

export const isLoading = computed(() => counter.value > 0 || waitingForImages.value)

export function showLoader() {
  counter.value = Math.max(0, counter.value) + 1
}

function _waitForImages(root = document.body, timeoutMs = 5000) {
  return new Promise((resolve) => {
    if (!root || typeof root.querySelectorAll !== 'function') return resolve()

    const imgs = Array.from(root.querySelectorAll('img')).filter(i => !i.complete)
    if (imgs.length === 0) return resolve()

    let settled = 0
    const onSettled = () => {
      settled++
      if (settled === imgs.length) resolve()
    }

    imgs.forEach(img => {
      img.addEventListener('load', onSettled, { once: true })
      img.addEventListener('error', onSettled, { once: true })
    })

    // Safety timeout
    setTimeout(resolve, timeoutMs)
  })
}

export async function hideLoader() {
  // decrement counter (never below 0)
  counter.value = Math.max(0, counter.value - 1)

  // if there are still active loaders, don't attempt to wait for images
  if (counter.value > 0) return

  // Wait for images to load before clearing the loading state to avoid flicker
  try {
    waitingForImages.value = true
    await _waitForImages(document.body)
  } finally {
    waitingForImages.value = false
  }
}

export default {
  isLoading,
  showLoader,
  hideLoader
}
