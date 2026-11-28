using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Nexo.Models.ViewModels;

// Casilla obligatoria, validada en servidor y en cliente.
public sealed class DebeAceptarAttribute : ValidationAttribute, IClientModelValidator
{
    public override bool IsValid(object? value) => value is true;

    public void AddValidation(ClientModelValidationContext context)
    {
        context.Attributes["data-val"] = "true";
        context.Attributes["data-val-required"] = ErrorMessage ?? "Debes aceptar para continuar.";
    }
}

// Formularios de acceso con sus validaciones.
public class LoginViewModel
{
    [Required(ErrorMessage = "Ingresa tu correo."), EmailAddress(ErrorMessage = "Correo no válido."), StringLength(256)]
    [Display(Name = "Correo electrónico")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Ingresa tu contraseña."), DataType(DataType.Password), StringLength(100)]
    [Display(Name = "Contraseña")]
    public string Password { get; set; } = "";

    [Display(Name = "Recordar sesión en este equipo")]
    public bool Recordar { get; set; }

    public string? ReturnUrl { get; set; }
}

// Campos que comparten todos los registros.
public abstract class CuentaViewModel
{
    [Required(ErrorMessage = "El nombre es obligatorio."), StringLength(150, MinimumLength = 3, ErrorMessage = "Entre 3 y 150 caracteres.")]
    [Display(Name = "Nombre y apellidos")]
    public string FullName { get; set; } = "";

    [Required(ErrorMessage = "El correo es obligatorio."), EmailAddress(ErrorMessage = "Correo no válido."), StringLength(256)]
    [Display(Name = "Correo electrónico")]
    public string Email { get; set; } = "";

    // BCrypt solo usa los primeros 72 bytes.
    [Required(ErrorMessage = "La contraseña es obligatoria."), DataType(DataType.Password)]
    [StringLength(72, MinimumLength = 8, ErrorMessage = "Entre 8 y 72 caracteres.")]
    [Display(Name = "Contraseña")]
    public virtual string Password { get; set; } = "";

    [DebeAceptar(ErrorMessage = "Debes aceptar los términos.")]
    public bool AceptaTerminos { get; set; }
}

public class RegistroUsuarioViewModel : CuentaViewModel
{
    [Required(ErrorMessage = "Indica tu ciudad."), StringLength(100)]
    [Display(Name = "Ciudad de residencia")]
    public string City { get; set; } = "";
}

public class RegistroOrganizadorViewModel : RegistroUsuarioViewModel
{
    [Required(ErrorMessage = "El nombre del colectivo es obligatorio."), StringLength(150)]
    [Display(Name = "Nombre del colectivo, sala o compañía")]
    public string OrganizationName { get; set; } = "";

    [StringLength(500, ErrorMessage = "Máximo 500 caracteres.")]
    [Display(Name = "Propuesta artística o línea editorial")]
    public string? Description { get; set; }
}

public class RegistroAdminViewModel : CuentaViewModel
{
    [Required(ErrorMessage = "La contraseña es obligatoria."), DataType(DataType.Password)]
    [StringLength(72, MinimumLength = 10, ErrorMessage = "Entre 10 y 72 caracteres.")]
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$", ErrorMessage = "Incluye letras, números y un carácter especial.")]
    [Display(Name = "Contraseña")]
    public override string Password { get; set; } = "";

    [Required(ErrorMessage = "El código de invitación es obligatorio."), StringLength(100)]
    [Display(Name = "Código de invitación")]
    public string CodigoInvitacion { get; set; } = "";
}
