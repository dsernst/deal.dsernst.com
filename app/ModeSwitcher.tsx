import { useLayoutEffect, useRef, useState } from 'react'

export const ModeContainer = ({
  children,
  tabs,
}: {
  children: (props: {
    ModeSwitcher: React.ReactNode
    overlapOnly: boolean
  }) => React.ReactNode
  tabs: string[]
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)

  return children({
    ModeSwitcher: <ModeSwitcher {...{ activeTab, setActiveTab, tabs }} />,
    overlapOnly: activeTab === 0,
  })
}

function ModeSwitcher({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: number
  setActiveTab: (index: number) => void
  tabs: string[]
}) {
  const tabsRef = useRef<HTMLButtonElement[]>([])
  const { clientWidth = 190, offsetLeft = 0 } = tabsRef.current[activeTab] || {}

  const [, rerender] = useState({})
  useLayoutEffect(() => rerender({}), []) // once refs set

  return (
    <div className="flew-row relative mx-auto flex py-2.5 px-2 rounded-full bg-neutral-800 backdrop-blur-sm">
      {/* Highlight active  */}
      <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
        style={{ left: offsetLeft, width: clientWidth }}
      >
        <span className="h-full w-full rounded-3xl bg-gray-200/15" />
      </span>

      {/* List of tabs */}
      {tabs.map((tab, index) => {
        const isActive = activeTab === index

        return (
          <button
            className={`${
              isActive ? '' : 'hover:text-neutral-300'
            } my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-white`}
            key={index}
            onClick={() => setActiveTab(index)}
            ref={(el: HTMLButtonElement) => {
              tabsRef.current[index] = el
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
