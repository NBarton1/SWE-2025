import { expect, vi } from "vitest";
import { renderWithWrap, mockTeams, mockScheduledMatch } from "../../../../vitest.setup.tsx";
import { screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import * as matchRequest from "../../../main/request/matches.ts";
import * as teamRequest from "../../../main/request/teams.ts";
import ScheduleExcelImporter from "../../../main/components/schedule/ScheduleExcelDropzone.tsx";
import type { Match } from "../../../main/types/match.ts";
import React from "react";
import * as XLSX from "xlsx";

// Mock XLSX library
vi.mock("xlsx", () => ({
    read: vi.fn(),
    utils: {
        sheet_to_json: vi.fn()
    },
    SSF: {
        parse_date_code: vi.fn()
    }
}));

// Mock Mantine Dropzone components
vi.mock("@mantine/dropzone", () => {
    const React = require('react');

    const DropzoneComponent = React.forwardRef(({ children, onDrop, onReject, disabled, ...props }: any, ref: any) => (
        <div
            ref={ref}
            data-testid="dropzone"
            data-disabled={disabled}
            onClick={() => {
                if (!disabled && onDrop) {
                    // Create a proper mock File with arrayBuffer method
                    const mockFile = new File(["test"], "test.xlsx", {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });

                    // Mock the arrayBuffer method to return a valid buffer
                    Object.defineProperty(mockFile, 'arrayBuffer', {
                        value: async () => new ArrayBuffer(8)
                    });

                    onDrop([mockFile]);
                }
            }}
        >
            {children}
        </div>
    ));

    DropzoneComponent.displayName = 'Dropzone';
    DropzoneComponent.Accept = ({ children }: any) => <div data-testid="dropzone-accept">{children}</div>;
    DropzoneComponent.Reject = ({ children }: any) => <div data-testid="dropzone-reject">{children}</div>;
    DropzoneComponent.Idle = ({ children }: any) => <div data-testid="dropzone-idle">{children}</div>;

    return {
        Dropzone: DropzoneComponent,
        MIME_TYPES: {
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    };
});

let mockProps: {
    setMatches: React.Dispatch<React.SetStateAction<Match[]>>
}

describe("ScheduleExcelImporter", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockProps = {
            setMatches: vi.fn(),
        };

        // Setup default mocks
        vi.spyOn(teamRequest, "getTeams").mockResolvedValue(mockTeams);
        vi.spyOn(matchRequest, "createMatch").mockResolvedValue(mockScheduledMatch);
    });

    test("renders ScheduleExcelImporter component", () => {
        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        expect(screen.getByTestId("create-match-form")).toBeInTheDocument();
        expect(screen.getByTestId("dropzone")).toBeInTheDocument();
    });

    test("renders dropzone with correct text", () => {
        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        expect(screen.getByText("Drag your file here or click to select file")).toBeInTheDocument();
        expect(screen.getByText("File must be an .xlsx file and under 5mb")).toBeInTheDocument();
    });

    test("renders note about Excel headers", () => {
        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        expect(screen.getByText("Note: Excel headers must be type, homeTeam, awayTeam, date, time")).toBeInTheDocument();
    });

    test("does not show notification initially", () => {
        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        expect(screen.queryByText("Successfully imported schedule!")).not.toBeInTheDocument();
    });

    test("handles successful file upload with single row", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "DK", awayTeam: "Chickens", date: 45000, time: 0.5 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 });

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        // Wait for the API call to be made
        await waitFor(() => {
            expect(matchRequest.createMatch).toHaveBeenCalled();
        });

        // Then check that the notification appears
        await waitFor(() => {
            expect(screen.getByText("Successfully imported schedule!")).toBeInTheDocument();
        });

        expect(matchRequest.createMatch).toHaveBeenCalledWith({
            type: "STANDARD",
            homeTeamId: "1",
            awayTeamId: "2",
            date: "2026-03-14T15:00"
        });
        expect(mockProps.setMatches).toHaveBeenCalled();
    });

    test("handles successful file upload with multiple rows", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "DK", awayTeam: "Chickens", date: 45000, time: 0.5 },
            { type: "playoff", homeTeam: "Eagles", awayTeam: "DK", date: 45001, time: 0.6 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 })
            .mockReturnValueOnce({ y: 2026, m: 3, d: 15 })
            .mockReturnValueOnce({ H: 16, M: 30 });

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        // Wait for all API calls to complete
        await waitFor(() => {
            expect(matchRequest.createMatch).toHaveBeenCalledTimes(2);
        });

        // Then check notification
        await waitFor(() => {
            expect(screen.getByText("Successfully imported schedule!")).toBeInTheDocument();
        });
    });

    test("normalizes date and time with single-digit padding", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "DK", awayTeam: "Chickens", date: 45000, time: 0.5 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 5 }) // Single digit month and day
            .mockReturnValueOnce({ H: 9, M: 7 }); // Single digit hour and minute

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(matchRequest.createMatch).toHaveBeenCalledWith({
                type: "STANDARD",
                homeTeamId: "1",
                awayTeamId: "2",
                date: "2026-03-05T09:07"
            });
        });
    });

    test("converts type to uppercase and trims whitespace", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "  playoff  ", homeTeam: "DK", awayTeam: "Chickens", date: 45000, time: 0.5 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 });

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(matchRequest.createMatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "PLAYOFF"
                })
            );
        });
    });

    test("does not show notification when team not found", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "UnknownTeam", awayTeam: "Chickens", date: 45000, time: 0.5 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 });
        vi.spyOn(console, "log").mockImplementation(() => {});

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(dropzone.getAttribute("data-disabled")).toBe("false");
        });

        expect(screen.queryByText("Successfully imported schedule!")).not.toBeInTheDocument();
        expect(matchRequest.createMatch).not.toHaveBeenCalled();
    });

    test("continues processing after a failed row", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "UnknownTeam", awayTeam: "Chickens", date: 45000, time: 0.5 },
            { type: "playoff", homeTeam: "Eagles", awayTeam: "DK", date: 45001, time: 0.6 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 })
            .mockReturnValueOnce({ y: 2026, m: 3, d: 15 })
            .mockReturnValueOnce({ H: 16, M: 30 });
        vi.spyOn(console, "log").mockImplementation(() => {});

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(dropzone.getAttribute("data-disabled")).toBe("false");
        });

        expect(matchRequest.createMatch).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("Successfully imported schedule!")).not.toBeInTheDocument();
    });

    test("handles match creation API failure", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "DK", awayTeam: "Chickens", date: 45000, time: 0.5 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 });
        vi.spyOn(matchRequest, "createMatch").mockRejectedValue(new Error("API Error"));
        vi.spyOn(console, "log").mockImplementation(() => {});

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(dropzone.getAttribute("data-disabled")).toBe("false");
        });

        expect(mockProps.setMatches).not.toHaveBeenCalled();
        expect(screen.getByText("Successfully imported schedule!")).toBeInTheDocument();
    });

    test("handles empty rows from Excel", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue([]);

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Excel file returned no rows.");
        });

        expect(matchRequest.createMatch).not.toHaveBeenCalled();
        expect(screen.queryByText("Successfully imported schedule!")).not.toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });

    test("handles Excel parsing error", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        vi.mocked(XLSX.read).mockImplementation(() => {
            throw new Error("Excel parse error");
        });

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Import failed:", expect.any(Error));
        });

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith("Excel file returned no rows.");
        });

        await waitFor(() => {
            expect(dropzone.getAttribute("data-disabled")).toBe("false");
        });

        expect(matchRequest.createMatch).not.toHaveBeenCalled();
        expect(screen.queryByText("Successfully imported schedule!")).not.toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
    test("notification can be closed", async () => {
        const mockWorkbook = {
            SheetNames: ["Sheet1"],
            Sheets: { Sheet1: {} }
        };
        const mockRawRows = [
            { type: "standard", homeTeam: "DK", awayTeam: "Chickens", date: 45000, time: 0.5 }
        ];

        vi.mocked(XLSX.read).mockReturnValue(mockWorkbook);
        vi.mocked(XLSX.utils.sheet_to_json).mockReturnValue(mockRawRows);
        vi.mocked(XLSX.SSF.parse_date_code)
            .mockReturnValueOnce({ y: 2026, m: 3, d: 14 })
            .mockReturnValueOnce({ H: 15, M: 0 });

        renderWithWrap(<ScheduleExcelImporter {...mockProps} />);

        const dropzone = screen.getByTestId("dropzone");
        dropzone.click();

        await waitFor(() => {
            expect(screen.getByText("Successfully imported schedule!")).toBeInTheDocument();
        });

        const closeButton = screen.getByRole("button");
        closeButton.click();

        await waitFor(() => {
            expect(screen.queryByText("Successfully imported schedule!")).not.toBeInTheDocument();
        });
    });
});