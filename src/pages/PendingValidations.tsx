import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountdownDeadline } from '../components/CountdownDeadline';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Text } from '../components/Text';
import { useVerifierStore } from '../Zustand/Store';

export default function PendingValidations() {
  const navigate = useNavigate();
  const { pendingValidations, batchApprove, batchReject } = useVerifierStore();

  // Optional: Simple state to handle sorting by days remaining
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Multi-select state for batch actions.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<'approve' | 'reject'>('approve');
  const selectAllRef = useRef<HTMLInputElement>(null);

  const sortedValidations = useMemo(
    () =>
      [...pendingValidations].sort((a, b) =>
        sortOrder === 'asc'
          ? a.daysRemaining - b.daysRemaining
          : b.daysRemaining - a.daysRemaining,
      ),
    [pendingValidations, sortOrder],
  );

  // Keep selection in sync with the queue: drop ids that are no longer pending.
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = prev.filter((id) => pendingValidations.some((t) => t.id === id));
      return next.length === prev.length ? prev : next;
    });
  }, [pendingValidations]);

  const allIds = sortedValidations.map((t) => t.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  // Native checkboxes expose "indeterminate" only via the DOM property.
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  const openBatch = (decision: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;
    setPendingDecision(decision);
    setModalOpen(true);
  };

  const handleConfirm = (decision: 'approve' | 'reject', notes: string) => {
    if (decision === 'approve') {
      batchApprove(selectedIds, notes);
    } else {
      batchReject(selectedIds, notes);
    }
    setSelectedIds([]);
    setModalOpen(false);
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <button
            onClick={() => navigate('/verifier')}
            className="text-gray-500 hover:text-gray-800 mb-2 text-sm font-medium transition"
          >
            &larr; Back to Dashboard
          </button>
          <Text role="display" as="h1">Pending Validations</Text>
          <Text role="body" as="p" className="text-gray-500 mt-1">
            Review and validate milestones submitted by vault owners.
          </Text>
        </div>

        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition"
        >
          Sort by Urgency: {sortOrder === 'asc' ? 'High to Low' : 'Low to High'}
        </button>
      </header>

      <section className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        {sortedValidations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Text role="body" as="h3">All caught up!</Text>
            <Text role="body" as="p" className="mt-2">There are no pending validations in your queue.</Text>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 w-12">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all validations"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                </th>
                <th className="p-4 font-medium text-sm text-gray-600">Vault & Milestone</th>
                <th className="p-4 font-medium text-sm text-gray-600">Owner</th>
                <th className="p-4 font-medium text-sm text-gray-600">Amount at Stake</th>
                <th className="p-4 font-medium text-sm text-gray-600">Deadline</th>
                <th className="p-4 font-medium text-sm text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedValidations.map((task) => {
                const checked = selectedIds.includes(task.id);
                return (
                  <tr
                    key={task.id}
                    className={`border-b border-gray-100 transition ${checked ? 'bg-blue-50/60' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${task.vaultName}`}
                        checked={checked}
                        onChange={() => toggleOne(task.id)}
                        className="h-4 w-4 cursor-pointer accent-blue-600"
                      />
                    </td>
                    <td className="p-4">
                      <Text role="body" as="p" className="font-semibold text-gray-800">{task.vaultName}</Text>
                      <Text role="body" as="p" className="text-sm text-gray-500 mt-1">{task.milestone}</Text>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-mono">
                        {task.owner}
                      </span>
                    </td>
                    <td className="p-4">
                      <Text role="body" as="p" className="font-medium text-gray-800">{task.amount}</Text>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <Text role="body" as="p" className="text-sm">{task.deadline}</Text>
                        <CountdownDeadline deadline={task.deadline} />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/verifier/queue/${task.id}`)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-sm font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Sticky batch action bar */}
      <div
        role="region"
        aria-label="Batch actions"
        className="sticky bottom-4 mx-auto w-full max-w-2xl rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg flex items-center justify-between gap-4"
      >
        <Text role="body" as="span" className="text-sm text-gray-600">
          {selectedIds.length} selected
        </Text>
        <div className="flex gap-3">
          <button
            onClick={() => openBatch('reject')}
            disabled={!hasSelection}
            className="px-4 py-2 text-sm font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject Selected
          </button>
          <button
            onClick={() => openBatch('approve')}
            disabled={!hasSelection}
            className="px-4 py-2 text-sm font-bold rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Approve Selected
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialDecision={pendingDecision}
        affectedCount={selectedIds.length}
      />
    </div>
  );
}
