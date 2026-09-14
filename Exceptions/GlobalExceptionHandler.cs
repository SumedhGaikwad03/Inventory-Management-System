using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace InventoryApi.Exceptions;

public class GlobalExceptionHandler : IExceptionHandler // we implement the IExceptionHandler interface for this
{
    private readonly ILogger<GlobalExceptionHandler> _logger; // declares logger will hold the ILogger type exception


    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger; // here is where di injection actually happens
    }

    // Dependency Injection gives us the logger implementation.
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // Log the actual exception internally.
        // The client should not receive unexpected internal details.
        _logger.LogError(
            exception,
            "An unhandled exception occurred."); // here we log the exception with internal details

        var statusCode = exception switch // switch happens based on the types of exceptions we receive
        {
            // Invalid input or business-rule violation.
            ArgumentException =>
                StatusCodes.Status400BadRequest,

            // Authentication failed.
            UnauthorizedAccessException =>
                StatusCodes.Status401Unauthorized,

            // Anything unexpected.
            _ =>
                StatusCodes.Status500InternalServerError
        };

        var response = new ProblemDetails // this creates a response object for the error as given below
        {
            Status = statusCode,

            Title = statusCode switch
            {
                StatusCodes.Status400BadRequest =>
                    "Invalid request.",

                StatusCodes.Status401Unauthorized =>
                    "Unauthorized.",

                _ =>
                    "An unexpected error occurred."
            },

            Detail = statusCode switch
            {
                StatusCodes.Status400BadRequest =>
                    exception.Message,

                StatusCodes.Status401Unauthorized =>
                    exception.Message,

                _ =>
                    "An unexpected error occurred."
            }
        };

        httpContext.Response.StatusCode = statusCode; // here we set the http status code

        await httpContext.Response.WriteAsJsonAsync(
            response,
            cancellationToken); // this means that we send this response to the console/user

        return true; // bool tells asp.net that I handled this exception.
    }
}
