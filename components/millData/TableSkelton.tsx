import React from 'react'
import { TableCell, TableRow } from '../ui/table'
import { Skeleton } from '../ui/skeleton'

const TableSkelton = () => {
  return (
    <>
    {[1, 2, 3, 4, 5 ].map((i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-8 w-8 " />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-24" />
        </TableCell>
        {Array.from({ length: 16 }).map((_, idx) => (
          <TableCell key={idx}>
            <Skeleton className="h-8 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
  )
}

export default TableSkelton
