import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Mesa from '../views/admin/Mesas';


jest.mock('../../api/mesa', () => ({
    agregarMesa: jest.fn(),
    bajaMesa: jest.fn(),
    getListMesa: jest.fn().mockResolvedValue([]),
}));

describe('Mesas Component', () => {
    beforeEach(() => {
      render(<Mesa />);
    });
});