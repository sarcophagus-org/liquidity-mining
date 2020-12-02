import { createContext, useContext } from 'react'
import { utils } from 'ethers'
import {
  useLiquidityMiningContract,
  useUsdcContract,
  useUsdtContract,
  useDaiContract,
  useSarcoContract,
  useDecimals
} from './contracts'
import {
  useTotalStakeUsdc,
  useTotalStakeUsdt,
  useTotalStakeDai,
} from './stakes'
import {
  useTotalRewards,
  useTotalClaimedRewards,
  useRewardsPerBlock
} from './rewards'
import {
  useCurrentBlock,
  useStartBlock,
  useFirstStakeBlock,
  useBlockLength,
} from './blocks'

let context

const createDataRoot = () => {
  context = createContext()

  context.displayName = "Data Provider"
  const Provider = context.Provider

  return ({ children }) => {
    const liquidityMining = useLiquidityMiningContract()

    const usdcContract = useUsdcContract(liquidityMining)
    const usdtContract = useUsdtContract(liquidityMining)
    const daiContract = useDaiContract(liquidityMining)
    const sarcoContract = useSarcoContract(liquidityMining)

    const decimalsUsdc = useDecimals(usdcContract)
    const decimalsUsdt = useDecimals(usdtContract)
    const decimalsDai = useDecimals(daiContract)
    const decimalsSarco = useDecimals(sarcoContract)

    const totalRewards = useTotalRewards(liquidityMining)
    const totalClaimedRewards = useTotalClaimedRewards(liquidityMining)

    const totalStakeUsdc = useTotalStakeUsdc(liquidityMining)
    const totalStakeUsdt = useTotalStakeUsdt(liquidityMining)
    const totalStakeDai = useTotalStakeDai(liquidityMining)

    const currentBlock = useCurrentBlock()
    const startBlock = useStartBlock(liquidityMining)
    const firstStakeBlock = useFirstStakeBlock(liquidityMining)
    const blockLength = useBlockLength(liquidityMining)

    const rewardsPerBlock = useRewardsPerBlock(totalRewards, blockLength)

    const dataContext = {
      totalRewards: utils.formatUnits(totalRewards, decimalsSarco),
      totalClaimedRewards: utils.formatUnits(totalClaimedRewards, decimalsSarco),
      rewardsPerBlock: utils.formatUnits(rewardsPerBlock, decimalsSarco),
      
      totalStakeUsdc: utils.formatUnits(totalStakeUsdc, decimalsUsdc),
      totalStakeUsdt: utils.formatUnits(totalStakeUsdt, decimalsUsdt),
      totalStakeDai: utils.formatUnits(totalStakeDai, decimalsDai),

      currentBlock,
      startBlock,
      firstStakeBlock,
      blockLength,
    }

    return <Provider value={dataContext}>{children}</Provider>
  }
}

const DataProvider = createDataRoot()

const useData = () => {
  return useContext(context)
}

export { DataProvider, useData }