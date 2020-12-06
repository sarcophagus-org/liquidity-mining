import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'

const useTotalRewards = (liquidityMining) => {
  const [totalSarcoRewards, setTotalSarcoRewards] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalRewards().then(sarco => {
      setTotalSarcoRewards(sarco)
    }).catch(error => console.error(error))

    const updateTotalRewards = (totalRewards) => {
      setTotalSarcoRewards(totalRewards)
    }

    liquidityMining.on('Deposit', updateTotalRewards)

    return () => {
      liquidityMining.removeListener('Deposit', updateTotalRewards)
    }

  }, [liquidityMining])

  return totalSarcoRewards
}

const useTotalClaimedRewards = (liquidityMining) => {
  const [totalClaimedSarcoRewards, setTotalClaimedSarcoRewards] = useState(BigNumber.from(0))

  useEffect(() => {
    if (!liquidityMining) return

    liquidityMining.totalClaimedRewards().then(sarco => {
        setTotalClaimedSarcoRewards(sarco)
      }).catch(error => console.error(error))

    const getClaimedRewards = (_, _sarco) => {
      setTotalClaimedSarcoRewards(sarco => sarco.add(_sarco))
    }

    liquidityMining.on('Payout', getClaimedRewards)

    return () => {
      liquidityMining.removeListener('Payout', getClaimedRewards)
    }
  }, [liquidityMining])

  return totalClaimedSarcoRewards
}

const useRewardsPerBlock = (totalRewards, blockLength) => {
  const [rewardsPerBlock, setRewardsPerBlock] = useState(BigNumber.from(0))

  useEffect(() => {
    if (blockLength.eq(0)) {
      setRewardsPerBlock(BigNumber.from(0))
      return
    }

    setRewardsPerBlock(totalRewards.div(blockLength))
  }, [blockLength, totalRewards])

  return rewardsPerBlock
}

export {
  useTotalRewards,
  useTotalClaimedRewards,
  useRewardsPerBlock,
}