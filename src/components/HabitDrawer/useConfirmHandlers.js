import { useConfirm } from 'primevue/useconfirm'
import useHabits from '../../store/habits'

function useConfirmHandlers() {
  const confirm = useConfirm()
  const { removeHabit, markHabitAsStopped } = useHabits()

  const confirmDelete = (habitName) => {
    confirm.require({
      message: 'Do you want to delete this habit?',
      icon: 'pi pi-info-circle',
      acceptProps: {
        label: 'Delete',
        severity: 'danger'
      },
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        removeHabit(habitName)
      }
    })
  }

  const confirmStop = (habitName) => {
    confirm.require({
      message: 'Do you want to stop this habit from today?',
      icon: 'pi pi-info-circle',
      acceptProps: {
        label: 'Stop the habit',
        severity: 'danger'
      },
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      accept: () => {
        markHabitAsStopped(habitName)
      }
    })
  }

  return {
    confirmDelete,
    confirmStop
  }
}

export default useConfirmHandlers
