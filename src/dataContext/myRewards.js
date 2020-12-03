import { useState, useEffect } from 'react'
import { BigNumber } from 'ethers'
import { useWeb3 } from '../web3'

const useMyPendingRewards = (liquidityMining, currentBlock) => {
  const [pendingRewards, setPendingRewards] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.totalUserStake(account).then(stake => {
      if (stake.gt(0)) {
        liquidityMining.callStatic.payout().then(reward => {
          setPendingRewards(reward)
        })
      } else {
        setPendingRewards(BigNumber.from(0))
      }
    })
    
  }, [liquidityMining, currentBlock, account])

  return pendingRewards
}

const useMyClaimedRewards = (liquidityMining) => {
  const [claimedRewards, setClaimedRewards] = useState(BigNumber.from(0))
  const { account } = useWeb3()

  useEffect(() => {
    if (!liquidityMining || !account) return

    liquidityMining.userClaimedRewards(account).then(reward => {
      setClaimedRewards(reward)
    })

    const addMyClaimedRewards = (_, __, ___, ____, reward) => {
      setClaimedRewards(rewards => rewards.add(reward))
    }

    const myClaimedRewardsFilter = liquidityMining.filters.Withdraw(account, null, null, null, null)
    liquidityMining.on(myClaimedRewardsFilter, addMyClaimedRewards)

    return () => {
      liquidityMining.removeListener(myClaimedRewardsFilter, addMyClaimedRewards)
    }
  }, [liquidityMining, account])

  return claimedRewards
}

export {
  useMyPendingRewards,
  useMyClaimedRewards
}